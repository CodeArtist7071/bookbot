const whatsapp = require('../services/whatsapp');
const reviewController = require('./reviews');
const { supabase } = require('../services/supabase');


// In-memory session storage (use Redis or DB for production)
const sessions = new Map();

/**
 * Flow Controller to manage conversational states via Baileys (QR Method)
 */
const flowController = {
  async handleMessage(businessId, from, msg) {
    let sessionKey = `${businessId}:${from}`;
    let session = sessions.get(sessionKey) || { step: 'GREETING', data: {} };
    
    // Parse Baileys message content
    const text = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || 
                 msg.message?.buttonsResponseMessage?.selectedDisplayText ||
                 msg.message?.listResponseMessage?.title || "";
    
    const selectedId = msg.message?.buttonsResponseMessage?.selectedButtonId || 
                       msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId;

    if (!text && !selectedId) {
        return; // Ignore empty/invalid messages
    }

    console.log(`[${businessId}] Handling session for ${from}:`, session.step, "Text:", text, "ID:", selectedId);


    // Handle review ratings specifically
    if (selectedId && selectedId.startsWith('rate_')) {
      return await reviewController.handleRatingResponse(businessId, from, selectedId);
    }

    try {
      // Step 1: Greeting & Service Selection
      if (session.step === 'GREETING' || text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
        return await this.sendServiceList(businessId, from);
      }

      // Step 2: Date Selection (after service is picked)
      if (selectedId && session.step === 'AWAITING_SERVICE') {
        session.data.serviceId = selectedId;
        session.step = 'AWAITING_DATE';
        sessions.set(sessionKey, session);
        return await this.sendDateSelection(businessId, from);
      }

      // Step 3: Time Slot Selection (after date is picked)
      if (selectedId && session.step === 'AWAITING_DATE') {
        session.data.date = selectedId;
        session.step = 'AWAITING_TIME';
        sessions.set(sessionKey, session);
        return await this.sendTimeSlots(businessId, from, session.data.serviceId, selectedId);
      }

      // Step 4: Confirmation (after time is picked)
      if (selectedId && session.step === 'AWAITING_TIME') {
        session.data.time = selectedId;
        session.step = 'AWAITING_CONFIRMATION';
        sessions.set(sessionKey, session);
        return await this.sendConfirmation(businessId, from, session.data);
      }

      // Final Step: Sync to DB
      if (selectedId && session.step === 'AWAITING_CONFIRMATION') {
        if (selectedId === 'confirm_yes') {
          await this.saveBooking(businessId, from, session.data);
          sessions.delete(sessionKey);
          return await whatsapp.sendText(businessId, from, "✅ Your appointment is confirmed! See you soon.");
        } else {
          sessions.delete(sessionKey);
          return await whatsapp.sendText(businessId, from, "No problem! Feel free to start again by saying 'Hi'.");
        }
      }

      // Fallback
      if (session.step !== 'GREETING') {
        return await whatsapp.sendText(businessId, from, "Sorry, I didn't quite get that. Type 'Hi' to start over.");
      }

    } catch (error) {
      console.error('Flow error:', error);
      return await whatsapp.sendText(businessId, from, "Oops! Something went wrong. Please try again later.");
    }
  },

  async sendServiceList(businessId, from) {
    console.log(`\n🔍 DEBUG: Fetching services for Business ID: [${businessId}]`);
    const { data: services, error } = await supabase.from('services').select('*').eq('business_id', businessId);
    
    console.log(`📊 DB RESULT: Found ${services?.length || 0} services. Error:`, error);
    if (services) {
      console.log('📝 SERVICES LIST:', services.map(s => ({ name: s.name, active: s.is_active })));
    }

    const activeServices = services?.filter(s => s.is_active === true) || [];

    if (activeServices.length === 0) {
        console.log(`[${businessId}] No active services found in DB.`);
        return await whatsapp.sendText(businessId, from, "Welcome! 🤖\n\nI found your business profile, but you haven't added any *Active* services yet.\n\n*Please go to Services and make sure your service is marked as 'Active'!*");
    }



    const text = "Welcome to our booking bot! 🤖\n\nPlease reply with the number of the service you'd like to book:\n\n" + 
                 services.map((s, i) => `*${i+1}.* ${s.name} ($${s.price})`).join('\n');

    // For simplicity with Baileys, we'll use text-based selection or simple buttons
    await whatsapp.sendButtons(businessId, from, text, services.map(s => ({ id: s.id, title: s.name })));

    sessions.set(`${businessId}:${from}`, { step: 'AWAITING_SERVICE', data: {} });
  },

  async sendDateSelection(businessId, from) {
    await whatsapp.sendButtons(businessId, from, "When would you like to come in?", [
      { id: 'today', title: 'Today' },
      { id: 'tomorrow', title: 'Tomorrow' }
    ]);
  },

  async sendTimeSlots(businessId, from, serviceId, dateChoice) {
    const slots = [
      { id: '09:00', title: '09:00 AM' },
      { id: '10:00', title: '10:00 AM' },
      { id: '11:00', title: '11:00 AM' },
      { id: '14:00', title: '02:00 PM' }
    ];

    await whatsapp.sendButtons(businessId, from, `Available slots for ${dateChoice}:`, slots);
  },

  async sendConfirmation(businessId, from, data) {
    const { data: service } = await supabase.from('services').select('name, price').eq('id', data.serviceId).single();
    
    const summary = `📝 *Booking Summary*\n\n` +
      `*Service:* ${service.name}\n` +
      `*Date:* ${data.date}\n` +
      `*Time:* ${data.time}\n` +
      `*Total:* $${service.price}\n\n` +
      `Confirm booking?`;

    await whatsapp.sendButtons(businessId, from, summary, [
      { id: 'confirm_yes', title: 'Yes, Confirm' },
      { id: 'confirm_no', title: 'No, Cancel' }
    ]);
  },

  async saveBooking(businessId, from, data) {
    const { data: service } = await supabase.from('services').select('price').eq('id', data.serviceId).single();

    let bookingDate = new Date();
    if (data.date === 'tomorrow') bookingDate.setDate(bookingDate.getDate() + 1);
    const [hours, minutes] = data.time.split(':');
    bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    await supabase.from('bookings').insert([{
      business_id: businessId,
      customer_name: "WhatsApp User",
      customer_phone: from,
      service_id: data.serviceId,
      booking_date: bookingDate.toISOString(),
      status: 'confirmed',
      total_price: service.price
    }]);
  }
};

module.exports = flowController;
