const bot = require('./lib/client')
const { VERSION } = require('./config')

const start = async () => {
    Debug.info(`Version ${VERSION}`)
  try {
    await bot.init()
    bot.logger.info('⏳ Database syncing!')
    await bot.DATABASE.sync()
    await bot.connect()
  } catch (error) {
    Debug.error(error);
    start();
  }
}
start();
