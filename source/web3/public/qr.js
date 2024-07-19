const { makeid } = require('./id')
const QRCode = require('qrcode')
const fs = require('fs')
const pino = require('pino')
const { default: Maher_Zubair, useMultiFileAuthState, Browsers, delay } = require('@whiskeysockets/baileys')

function removeFile(FilePath) {
 if (!fs.existsSync(FilePath)) return false
 fs.rmSync(FilePath, { recursive: true, force: true })
}

async function generateQR(req, res) {
 const id = makeid()
 const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id)

 let isResponseSent = false // Track if the response has been sent

 try {
  let Qr_Code_By_Maher_Zubair = Maher_Zubair({
   auth: state,
   printQRInTerminal: false,
   logger: pino({ level: 'silent' }),
   browser: Browsers.macOS('Desktop'),
  })

  Qr_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds)

  Qr_Code_By_Maher_Zubair.ev.on('connection.update', async (s) => {
   const { connection, lastDisconnect, qr } = s

   if (qr && !isResponseSent) {
    try {
     const qrBuffer = await QRCode.toBuffer(qr)
     res.type('png').send(qrBuffer)
     isResponseSent = true // Mark the response as sent
    } catch (err) {
     console.error('Error generating QR code buffer:', err)
     if (!isResponseSent) {
      res.status(500).send('Error generating QR code')
      isResponseSent = true
     }
    }
   }

   if (connection === 'open') {
    try {
     await delay(5000)
     let data = fs.readFileSync(`./temp/${id}/creds.json`)
     await delay(800)
     let b64data = Buffer.from(data).toString('base64')
     let session = await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, { text: 'SIGMA-MD;;;' + b64data })

     let SIGMA_MD_TEXT = `
*_Qr Code By Maher Zubair_*
*_Made With 🤍_*

_Don't Forget To Give Star To My Repo_`
     await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, { text: SIGMA_MD_TEXT }, { quoted: session })

     await delay(100)
     await Qr_Code_By_Maher_Zubair.ws.close()
     await removeFile('temp/' + id)
    } catch (err) {
     console.error('Error during connection update:', err)
     if (!isResponseSent) {
      res.status(500).send('Error processing connection update')
      isResponseSent = true
     }
     await removeFile('temp/' + id)
    }
   } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
    await delay(10000)
    await generateQR(req, res)
   }
  })
 } catch (err) {
  console.error('Error initializing QR generation:', err)
  if (!isResponseSent) {
   res.status(500).json({ code: 'Service Unavailable' })
   isResponseSent = true
  }
  await removeFile('temp/' + id)
 }
}

module.exports = { generateQR }
