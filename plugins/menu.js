const { bot } = require('../lib')
const { handleMenuCommand } = require('./buttons')

bot(
 {
  pattern: 'null',
  desc: 'Show All Commands',
  dontAddCommandList: true,
 },
 handleMenuCommand
)
