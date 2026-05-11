/**
 * Service to interact with WhatsApp via Baileys (QR Method)
 * Note: We removed the top-level require for whatsappManager to avoid circular dependencies.
 */
const whatsappService = {
  /**
   * Send a simple text message
   */
  async sendText(businessId, to, text) {
    // Dynamically require to avoid circular dependency
    const whatsappManager = require('./whatsappManager');
    
    try {
      const sock = whatsappManager.getSession(businessId);
      if (!sock) throw new Error(`WhatsApp session not active for business ${businessId}`);
      
      const jid = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;
      
      await sock.sendMessage(jid, { text });
      return { success: true };
    } catch (error) {
      console.error('Error sending text via Baileys:', error.message);
      throw error;
    }
  },

  /**
   * Send button message
   */
  async sendButtons(businessId, to, text, buttons) {
    const whatsappManager = require('./whatsappManager');

    try {
      const sock = whatsappManager.getSession(businessId);
      if (!sock) throw new Error(`WhatsApp session not active for business ${businessId}`);

      const jid = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;

      const buttonMessage = {
        text: text,
        buttons: buttons.map(btn => ({
          buttonId: btn.id,
          buttonText: { displayText: btn.title },
          type: 1
        })),
        headerType: 1
      };

      await sock.sendMessage(jid, buttonMessage);
      return { success: true };
    } catch (error) {
      console.error('Error sending buttons via Baileys:', error.message);
      // Fallback: Send as text if buttons fail
      const fallbackText = `${text}\n\n` + buttons.map((b, i) => `${i+1}. ${b.title}`).join('\n');
      return this.sendText(businessId, to, fallbackText);
    }
  }
};

module.exports = whatsappService;
