const { bot } = require('../lib')
const { handleMenuCommand } = require('../lib/menu')

bot(
 {
  pattern: 'menu',
  desc: 'Show All Commands',
  dontAddCommandList: true,
 },
 handleMenuCommand
)
