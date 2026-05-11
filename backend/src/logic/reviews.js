const whatsapp = require('../services/whatsapp');
const { supabase } = require('../services/supabase');


/**
 * Review Journey logic for Baileys (QR Method)
 */
const reviewController = {
  /**
   * Send a review request to a customer
   */
  async sendReviewRequest(businessId, bookingId) {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_phone,
          business_id,
          businesses (name)
        `)
        .eq('id', bookingId)
        .single();

      if (error || !booking) throw new Error('Booking not found');

      const businessName = booking.businesses.name;
      const text = `Hi! How was your experience at *${businessName}* today? Please rate us from 1 to 5 stars:`;

      await whatsapp.sendButtons(businessId, booking.customer_phone, text, [
        { id: `rate_${bookingId}_5`, title: '⭐⭐⭐⭐⭐' },
        { id: `rate_${bookingId}_4`, title: '⭐⭐⭐⭐' },
        { id: `rate_${bookingId}_3`, title: '⭐⭐⭐ or less' }
      ]);

      console.log(`Review request sent for booking ${bookingId}`);
    } catch (error) {
      console.error('Error sending review request:', error);
    }
  },

  /**
   * Handle the user's rating response
   */
  async handleRatingResponse(businessId, from, ratingId) {
    const parts = ratingId.split('_');
    const bookingId = parts[1];
    const rating = parseInt(parts[2]);

    // Save review to DB
    await supabase.from('reviews').insert([{
      booking_id: bookingId,
      rating: rating,
      comment: "Rating provided via WhatsApp"
    }]);

    if (rating >= 4) {
      await whatsapp.sendText(businessId, from, "🌟 We are glad you loved it! Could you please share this on Google to help us grow? \n\n[Google Review Link]");
    } else {
      await whatsapp.sendText(businessId, from, "😔 We are sorry to hear that. Could you tell us what went wrong so we can fix it? (Just reply to this message)");
    }
  }
};

module.exports = reviewController;
