const { bot } = require('../lib')
const { handleMenuCommand } = require('./buttons')

bot(
 {
  pattern: 'menu',
  desc: 'Show All Commands',
  dontAddCommandList: true,
 },
 handleMenuCommand
)
