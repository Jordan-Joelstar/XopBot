const axios = require('axios')
const { fetchJson, runtime, Config } = require('../lib/index')
const { bot } = require('../lib/plugins')
const { groupdb } = require('../lib/schemes')
const { tlang } = require('../lib/scraper')

async function sendWelcome(context, welcomeMessage = '', buttons = '', mentionedJids = '', messageType = 'msg', includeContextInfo = false) {
 try {
  if (!welcomeMessage) return

  let formattedMessage = welcomeMessage

  if (context.isGroup) {
   // Fetch group owner's name
   let ownerName = 'Unknown'
   if (context.metadata.owner) {
    try {
     const ownerContact = await context.bot.getContactById(context.metadata.owner)
     ownerName = ownerContact.pushName || context.metadata.owner.split('@')[0]
    } catch (error) {
     console.log('Error fetching owner name:', error)
     ownerName = context.metadata.owner.split('@')[0]
    }
   }

   formattedMessage = formattedMessage
    .replace(/@gname|&gname/gi, context.metadata.subject)
    .replace(/@desc|&desc/gi, context.metadata.desc || 'No description')
    .replace(/@count|&count/gi, context.metadata.participants.length)
    .replace(/@groupid|&groupid/gi, context.chat)
    .replace(/@groupowner|&groupowner/gi, ownerName)
    .replace(/@grouplocation|&grouplocation/gi, context.metadata.location || 'Not specified')
    .replace(/@groupcreation|&groupcreation/gi, new Date(context.metadata.creation * 1000).toLocaleString())
    .replace(/@grouplink|&grouplink/gi, context.metadata.invite || 'No invite link available')
    .replace(/@admins|&admins/gi, context.metadata.participants.filter((p) => p.admin).length)
    .replace(/@restrictions|&restrictions/gi, context.metadata.restrict ? 'Restricted' : 'Not restricted')
    .replace(/@announce|&announce/gi, context.metadata.announce ? 'Announcement mode ON' : 'Announcement mode OFF')

   // Add a list of admin names if @adminlist is used
   if (/@adminlist|&adminlist/gi.test(formattedMessage)) {
    const adminList = await Promise.all(
     context.metadata.participants
      .filter((p) => p.admin)
      .map(async (p) => {
       const contact = await context.bot.getContactById(p.id)
       return contact.pushName || p.id.split('@')[0]
      })
    )
    formattedMessage = formattedMessage.replace(/@adminlist|&adminlist/gi, adminList.join(', ') || 'No admins')
   }
  }

  formattedMessage = formattedMessage
   .replace(/@user|&user/gi, context.senderName)
   .replace(/@name|&name/gi, context.pushName || '_')
   .replace(/@time|&time/gi, context.time)
   .replace(/@date|&date/gi, context.date)
   .replace(/@bot|&bot/gi, Config.botname)
   .replace(/@owner|&owner/gi, Config.ownername)
   .replace(/@gurl|@website|&gurl|&website|@link|&link/gi, context.gurl || '')
   .replace(/@runtime|&runtime|@uptime|&uptime/gi, runtime(process.uptime()))
   .trim()
  try {
   const pickupLine = await fetchJson('https://api.popcat.xyz/pickuplines')
   formattedMessage = formattedMessage.replace(/@line|&line/gi, pickupLine.pickupline || '')
  } catch (error) {
   formattedMessage = formattedMessage.replace(/@line|&line/gi, '')
  }

  try {
   if (/@quote|&quote/gi.test(formattedMessage)) {
    const { data: quoteData } = await axios.get('https://favqs.com/api/qotd')
    if (quoteData && quoteData.quote) {
     formattedMessage = formattedMessage.replace(/@quote|&quote/gi, quoteData.quote.body || '').replace(/@author|&author/gi, quoteData.quote.author || '')
    }
   }
  } catch (error) {
   formattedMessage = formattedMessage.replace(/@quote|&quote|@author|&author/gi, '')
  }

  if (messageType === 'msg' || !messageType) {
   try {
    if (typeof mentionedJids === 'string') {
     mentionedJids = mentionedJids.split(',')
    }
    if (/@user|&user/g.test(welcomeMessage) && !mentionedJids.includes(context.sender)) {
     mentionedJids.push(context.sender)
    }
   } catch (error) {
    console.log('ERROR : ', error)
   }

   const contextInfo = {
    ...(includeContextInfo || /@context|&context/g.test(welcomeMessage) ? await context.bot.contextInfo(Config.botname, context.pushName) : {}),
    mentionedJid: mentionedJids,
   }

   return await context.send(
    formattedMessage,
    {
     mentions: mentionedJids,
     contextInfo: contextInfo,
    },
    buttons
   )
  } else {
   return formattedMessage
  }
 } catch (error) {
  console.log(error)
  return formattedMessage // Return the formatted message even if there's an error
 }
}

bot(
 {
  pattern: 'welcome',
  desc: 'sets welcome message in specific group.',
  category: 'group',
 },
 async (context, args) => {
  await handleGroupMessage(context, args, 'welcome')
 }
)

bot(
 {
  pattern: 'goodbye',
  desc: 'sets goodbye message in specific group.',
  category: 'group',
 },
 async (context, args) => {
  await handleGroupMessage(context, args, 'goodbye')
 }
)

async function handleGroupMessage(context, args, messageType) {
 try {
  if (!context.isGroup) {
   return context.reply(tlang().group)
  }
  if (!context.isAdmin && !context.isCreator) {
   return context.reply(tlang().admin)
  }

  const command = args.toLowerCase().trim()
  const groupData = (await groupdb.findOne({ id: context.chat })) || (await groupdb.new({ id: context.chat }))
  const isWelcome = messageType === 'welcome'
  const dbField = isWelcome ? 'welcome' : 'goodbye'
  const textField = isWelcome ? 'welcometext' : 'goodbyetext'

  if (['on', 'act', 'enable'].includes(command)) {
   if (groupData[dbField] === 'true') {
    return await context.send(`*_${messageType} already enabled in current group!!_*`)
   }
   await groupdb.updateOne({ id: context.chat }, { [dbField]: 'true' })
   return await context.send(`*${messageType} successfully enabled!!*`)
  }

  if (groupData[dbField] !== 'true') {
   return await context.send(`*_${messageType} *Disabled in this Group!_* \n*_Use on/off to enable/disable ${messageType}_*`)
  }

  if (!args || command === 'get') {
   const formattedMessage = await sendWelcome(context, groupData[textField], '', '', 'text')
   return await context.reply(formattedMessage)
  }

  if (['off', 'disable'].includes(command)) {
   if (groupData[dbField] === 'false') {
    return await context.send(`*_${messageType} already disabled in current group!!_*`)
   }
   await groupdb.updateOne({ id: context.chat }, { [dbField]: 'false' })
   return await context.send(`*${messageType} message disabled!!*`)
  }

  // Save the raw message to the database
  await groupdb.updateOne(
   { id: context.chat },
   {
    [textField]: args,
    [dbField]: 'true',
   }
  )

  // Format and send the welcome message as a preview
  const formattedMessage = await sendWelcome(context, args, '', '', 'text')
  await context.send(formattedMessage)
 } catch (error) {
  context.error(`${error}\n\ncommand: set${messageType}`, error)
 }
}
