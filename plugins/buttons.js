const {bot}=require('../lib')
bot(
  {
    pattern: "btn",
    desc: "Send a basic interactive message with a button.",
    category: "general",
    filename: __filename,
  },
  async (m) => {
    try {
      await m.sendMessage(m.jid, {
        title: 'Hello!',
        text: 'This is a basic interactive message.',
        footer: 'Footer Text',
        buttons: [
          { type: 'button', display_text: 'Click Me', id: 'btn_1' }
        ]
      });
    } catch (error) {
      console.error('Error sending interactive message:', error);
    }
  }
);
