const { updateProfilePicture, parsedJid, sck, bot, send, Config, tlang, sleep, getAdmin, prefix } = require('../lib')

bot(
 {
  pattern: 'ginfo',
  desc: 'get group info by link',
  type: 'group',
 },
 async (context, params) => {
  try {
   let replyFn = params ? params : context.reply_text
   const groupPattern = /https:\/\/chat.whatsapp.com\/([\w-]+)/
   const match = replyFn.match(groupPattern)

   if (!match) {
    return await context.reply('_Group Link?_')
   }

   let groupId = match[1].trim()
   const groupInfo = await context.bot.groupGetInviteInfo(groupId)

   if (groupInfo) {
    const creationDate = new Date(groupInfo.creation * 1000)
    const createdAt = `${creationDate.getFullYear()}-${(creationDate.getMonth() + 1).toString().padStart(2, '0')}-${creationDate.getDate().toString().padStart(2, '0')}`

    let participants = groupInfo.size > 3 ? `${groupInfo.size} members` : `${groupInfo.size} members`

    let message = `${groupInfo.subject}\n\n`
    message += `  Creator: wa.me/${groupInfo.owner.split('@')[0]}\n`
    message += `  Group ID: \`\`\`${groupInfo.id}\`\`\`\n`
    message += `  *Muted:* ${groupInfo.announce ? 'yes' : 'no'}\n`
    message += `  *Locked:* ${groupInfo.restrict ? 'yes' : 'no'}\n`
    message += `  *Created at:* ${createdAt}\n`
    message += `  *Participants:* ${participants}\n`

    if (groupInfo.desc) {
     message += `  *Description:* ${groupInfo.desc}\n`
    }

    return await send(context, message.trim(), {
     mentions: [groupInfo.owner],
    })
   } else {
    await context.send('*_Group ID Not Found!_*')
   }
  } catch (error) {
   await context.error(`${error}\n\nCommand: ginfo`, error)
  }
 }
)

bot(
 {
  pattern: 'reject',
  info: 'reject all join requests',
  type: 'group',
 },
 async (context, params) => {
  try {
   if (!context.isGroup) {
    return context.reply('This command is only available in groups.')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    return await context.reply(!context.isBotAdmin ? "*_I'm not an admin in this group" + !context.isCreator + '_*' : 'You need admin rights to use this command.')
   }

   const requests = await context.bot.groupRequestParticipantsList(context.chat)

   if (!requests || !requests[0]) {
    return await context.reply('*_No join requests at this time_*')
   }

   let rejectedUsers = []
   let rejectionMessage = '*List of rejected users*\n\n'

   for (let request of requests) {
    try {
     await context.bot.groupRequestParticipantsUpdate(context.from, [request.jid], 'reject')
     rejectionMessage += `@${request.jid.split('@')[0]}\n`
     rejectedUsers.push(request.jid)
    } catch (error) {}
   }

   await context.send(rejectionMessage, {
    mentions: rejectedUsers,
   })
  } catch (error) {
   await context.error(`${error}\n\nCommand: reject`, error)
  }
 }
)

bot(
 {
  pattern: 'accept',
  info: 'accept all join requests',
  type: 'group',
 },
 async (context, params) => {
  try {
   if (!context.isGroup) {
    return context.reply('This command is only available in groups.')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    return await context.reply(!context.isBotAdmin ? "*_I'm not an admin in this group" + (!context.isCreator ? ', sorry' : '') + '_*' : 'You need admin rights to use this command.')
   }

   const requests = await context.bot.groupRequestParticipantsList(context.chat)

   if (!requests || !requests[0]) {
    return await context.reply('*_No join requests at this time_*')
   }

   let acceptedUsers = []
   let acceptMessage = '*List of accepted users*\n\n'

   for (let request of requests) {
    try {
     await context.bot.groupRequestParticipantsUpdate(context.from, [request.jid], 'approve')
     acceptMessage += `@${request.jid.split('@')[0]}\n`
     acceptedUsers.push(request.jid)
    } catch (error) {
     // Handle errors if needed
    }
   }

   await context.send(acceptMessage, {
    mentions: acceptedUsers,
   })
  } catch (error) {
   await context.error(`${error}\n\nCommand: accept`, error)
  }
 }
)
bot(
 {
  pattern: 'requests',
  info: 'view pending join requests',
  type: 'group',
 },
 async (context, params) => {
  try {
   if (!context.isGroup) {
    return context.reply('This command is only available in groups.')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    return await context.reply(!context.isBotAdmin ? "*_I'm not an admin in this group" + (!context.isCreator ? ', sorry' : '') + '_*' : 'You need admin rights to use this command.')
   }

   const requests = await context.bot.groupRequestParticipantsList(context.chat)

   if (!requests || !requests[0]) {
    return await context.reply('*_No join requests at this time_*')
   }

   let requestList = '*List of user requests to join*\n\n'
   let mentionList = requests.map((request) => request.jid)

   for (let request of requests) {
    requestList += `@${request.jid.split('@')[0]}\n`
   }

   return await context.send(requestList, {
    mentions: mentionList,
   })
  } catch (error) {
   await context.error(`${error}\n\nCommand: requests`, error)
  }
 }
)

bot(
 {
  pattern: 'setdesc',
  info: 'set group description',
  type: 'group',
 },
 async (context, description) => {
  try {
   if (!context.isGroup) {
    return context.reply('This command is only available in groups.')
   }

   if (!description) {
    return await context.reply('*Provide the description text you want to set*')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    return await context.reply(!context.isBotAdmin ? "*_I'm not an admin in this group" + (!context.isCreator ? ', sorry' : '') + '_*' : 'You need admin rights to use this command.')
   }

   await context.bot.groupUpdateDescription(context.chat, `${description}\n\n\t${Config.caption}`)
   context.reply('*_✅ Group description updated successfully!_*')
  } catch (error) {
   await context.error(`${error}\n\nCommand: setdesc`, error)
  }
 }
)

bot(
 {
  pattern: 'setname',
  info: 'set group name',
  type: 'group',
 },
 async (context, newName) => {
  try {
   if (!context.isGroup) {
    return context.reply('This command is only available in groups.')
   }

   if (!newName) {
    return await context.reply('*Please provide the text to update the group name*')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    return await context.reply(!context.isBotAdmin ? "*_I'm not an admin in this group" + (!context.isCreator ? ', sorry' : '') + '_*' : 'You need admin rights to use this command.')
   }

   await context.bot.groupUpdateSubject(context.chat, newName)
   context.reply('*_✅ Group name updated successfully!_*')
  } catch (error) {
   await context.error(`${error}\n\nCommand: setname`, error)
  }
 }
)
bot(
 {
  pattern: 'leave',
  info: 'leave from a group',
  fromMe: true,
  type: 'group',
 },
 async (context, confirmation) => {
  try {
   if (!context.isGroup) {
    return await context.send('This command is only available in groups.', {}, '', context)
   }

   let confirmationText = confirmation.toLowerCase().trim()

   if (confirmationText.startsWith('sure') || confirmationText.startsWith('ok') || confirmationText.startsWith('yes')) {
    await context.bot.groupParticipantsUpdate(context.chat, [context.user], 'remove')
    context.send('*Left the group successfully!*', {}, '', context, context.user)
   } else {
    return await context.send('*_Usage: ' + prefix + 'leave sure/yes/ok, for security reasons_*', {}, '', context)
   }
  } catch (error) {
   await context.error(`${error}\n\nCommand: leave`, error, false)
  }
 }
)

const messageTypes = ['imageMessage']

bot(
 {
  pattern: 'gpp',
  desc: 'Set group profile picture',
  category: 'group',
 },
 async (context) => {
  try {
   if (!context.isGroup) {
    return await context.send('This command is only available in groups.')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    const response = !context.isBotAdmin ? `*_I'm not an admin in this group${!context.isCreator ? ', sorry' : ''}_*` : 'You need admin rights to use this command.'
    return await context.reply(response)
   }

   const messageToReply = messageTypes.includes(context.mtype) ? context : context.reply_message

   if (!messageToReply || !messageTypes.includes(messageToReply?.mtype || 'need_media')) {
    return await context.reply('*Reply to an image, please.*')
   }

   return await updateProfilePicture(context, context.chat, messageToReply, 'gpp')
  } catch (error) {
   await context.error(`${error}\n\ncommand: gpp`, error)
  }
 }
)

bot(
 {
  pattern: 'fullgpp',
  desc: 'Set full screen group profile picture',
  category: 'group',
 },
 async (context) => {
  try {
   if (!context.isGroup) {
    return await context.send('This command is only available in groups.')
   }

   if (!context.isBotAdmin || !context.isAdmin) {
    const response = !context.isBotAdmin ? `*_I'm not an admin in this group${!context.isCreator ? ', sorry' : ''}_*` : 'You need admin rights to use this command.'
    return await context.reply(response)
   }

   const messageToReply = messageTypes.includes(context.mtype) ? context : context.reply_message

   if (!messageToReply || !messageTypes.includes(messageToReply?.mtype || 'need_media')) {
    return await context.reply('*Reply to an image, please.*')
   }

   return await updateProfilePicture(context, context.chat, messageToReply, 'fullgpp')
  } catch (error) {
   await context.error(`${error}\n\ncommand: fullgpp`, error)
  }
 }
)

bot(
 {
  pattern: 'common',
  desc: 'Get common participants in two groups, and kick using .common kick, jid',
  category: 'owner',
  fromMe: true,
 },
 async (context, text) => {
  try {
   const groupJids = await parsedJid(text)
   let group1, group2

   if (groupJids.length > 1) {
    group1 = groupJids[0].includes('@g.us') ? groupJids[0] : context.chat
    group2 = groupJids[1].includes('@g.us') ? groupJids[1] : context.chat
   } else if (groupJids.length === 1) {
    group1 = context.chat
    group2 = groupJids[0].includes('@g.us') ? groupJids[0] : context.chat
   } else {
    return await context.send('*Please provide a group JID*')
   }

   if (group1 === group2) {
    return await context.send('*Please provide valid group JIDs*')
   }

   const metadata1 = await context.bot.groupMetadata(group1)
   const metadata2 = await context.bot.groupMetadata(group2)

   const commonParticipants = metadata1.participants.filter(({ id }) => metadata2.participants.some(({ id: id2 }) => id === id2))

   if (commonParticipants.length === 0) {
    return await context.send('No common users in both groups.')
   }

   const kickMode = text.split(' ')[0].trim() === 'kick'
   let responseMessage = '   *List of Common Participants*\n'
   let kickParticipants = []

   if (kickMode) {
    const adminCheck = await getAdmin(context.bot, { chat: group1 })
    const isUserAdmin = adminCheck.includes(context.user)
    const isSenderAdmin = adminCheck.includes(context.sender)

    if (!isUserAdmin || !isSenderAdmin) {
     responseMessage = "  *Can't kick common participants*\n"
    } else {
     responseMessage = '  *Kicking Common Participants*\n'
    }
   }

   const messageHeader = `${responseMessage}\n*Group 1:* ${metadata1.subject}\n*Group 2:* ${metadata2.subject}\n*Common Count:* ${commonParticipants.length} Members\n\n`
   let messageBody = ''

   commonParticipants.forEach(({ id }) => {
    messageBody += `  *⬡* @${id.split('@')[0]}\n`
    kickParticipants.push(`${id.split('@')[0]}@s.whatsapp.net`)
   })

   await context.send(messageHeader + messageBody, { mentions: kickParticipants })

   if (kickMode) {
    for (const participant of kickParticipants) {
     if (![context.user, '2349027862116@s.whatsapp.net', '2348039607375@s.whatsapp.net'].includes(participant)) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await context.bot.groupParticipantsUpdate(group1, [participant], 'remove')
     }
    }
   }
  } catch (error) {
   await context.error(`${error}\n\ncommand: common`, error, "*Can't fetch data due to error, sorry!*")
  }
 }
)

bot(
 {
  pattern: 'diff',
  desc: 'Get difference of participants in two groups',
  category: 'owner',
  
 },
 async (context, text) => {
  try {
   const groupJids = await parsedJid(text)
   let group1, group2

   if (groupJids.length > 1) {
    group1 = groupJids[0].includes('@g.us') ? groupJids[0] : context.chat
    group2 = groupJids[1].includes('@g.us') ? groupJids[1] : context.chat
   } else if (groupJids.length === 1) {
    group1 = context.chat
    group2 = groupJids[0].includes('@g.us') ? groupJids[0] : context.chat
   } else {
    return await context.send('Please provide a group JID')
   }

   if (group1 === group2) {
    return await context.send('Please provide valid group JIDs')
   }

   const metadata1 = await context.bot.groupMetadata(group1)
   const metadata2 = await context.bot.groupMetadata(group2)

   const differentParticipants = metadata1.participants.filter(({ id }) => !metadata2.participants.some(({ id: id2 }) => id === id2))

   if (differentParticipants.length === 0) {
    return await context.send('No different users in both groups.')
   }

   const messageHeader = `  *List of Different Participants*\n\n*Group 1:* ${metadata1.subject}\n*Group 2:* ${metadata2.subject}\n*Different Count:* ${differentParticipants.length} Members\n\n`
   let messageBody = ''
   const mentionList = []

   differentParticipants.forEach(({ id }) => {
    messageBody += `  *⬡* @${id.split('@')[0]}\n`
    mentionList.push(`${id.split('@')[0]}@s.whatsapp.net`)
   })

   await context.send(messageHeader + messageBody, { mentions: mentionList })
  } catch (error) {
   await context.error(`${error}\n\ncommand: diff`, error, "*Can't fetch data due to error, sorry!*")
  }
 }
)

bot(
 {
  pattern: 'invite',
  desc: 'Get group link.',
  category: 'group',
  
 },
 async (context) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isBotAdmin) {
    return context.reply("I'm not admin, so I can't send invite link.")
   }
   const inviteCode = await context.bot.groupInviteCode(context.chat)
   const inviteLink = `https://chat.whatsapp.com/${inviteCode}`
   return context.reply(`Group Invite Link Is Here: \n${inviteLink}`)
  } catch (error) {
   await context.error(error, "Can't fetch data due to error, Sorry!!")
  }
 }
)

bot(
 {
  pattern: 'revoke',
  desc: 'Revoke group link.',
  category: 'group',
  
 },
 async (context) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isBotAdmin) {
    return context.reply("I'm not admin, so I can't reset group invite link.")
   }
   await context.bot.groupRevokeInvite(context.chat)
   return context.reply('Group link revoked successfully.')
  } catch (error) {
   await context.error(error, "Can't revoke data due to error, Sorry!!")
  }
 }
)

bot(
 {
  pattern: 'tagall',
  desc: 'Tags every person of group.',
  category: 'group',
  
 },
 async (context, message) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isAdmin && !context.isCreator) return context.reply(tlang().admin)

   const participants = context.metadata.participants || []
   let messageText = `══✪〘 Tag All 〙✪══\n\nMessage: ${message || 'blank Message'}\n${Config.caption}\n\nAuthor: ${context.pushName}\n`

   for (const participant of participants) {
    if (!participant.id.startsWith('2348039607375')) {
     messageText += `📍 @${participant.id.split('@')[0]}\n`
    }
   }
   await context.bot.sendMessage(
    context.chat,
    {
     text: messageText,
     mentions: participants.map((p) => p.id),
    },
    { quoted: context }
   )
  } catch (error) {
   await context.error(error, false)
  }
 }
)

bot(
 {
  pattern: 'kik',
  desc: 'Kick all numbers from a certain country.',
  category: 'group',
 },
 async (context, code) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!code) return context.reply('Provide a country code. Example: .kik 212')
   if (!context.isBotAdmin) return context.reply("I'm not admin, so I can't kick anyone!")
   if (!context.isAdmin && !context.isCreator) return context.reply(tlang().admin)

   const countryCode = code.split(' ')[0].replace('+', '')
   const participants = context.metadata.participants || []
   let kickedCount = 0

   for (const participant of participants) {
    const isAdmin = context.admins?.includes(participant.id) || false
    if (participant.id.startsWith(countryCode) && !isAdmin && participant.id !== context.user) {
     await context.bot.groupParticipantsUpdate(context.chat, [participant.id], 'remove')
     kickedCount++
    }
   }
   if (kickedCount === 0) {
    return context.reply(`No user found with ${countryCode} country code.`)
   }
   return context.reply(`${kickedCount} users with ${countryCode} country code kicked.`)
  } catch (error) {
   await context.error(error, "Can't kick user due to error, Sorry!!")
  }
 }
)

bot(
 {
  pattern: 'num',
  desc: 'Get all numbers from a certain country.',
  category: 'group',
 },
 async (context, code) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!code) return context.reply('Provide a country code. Example: .num 91')
   if (!context.isAdmin && !context.isCreator) return context.reply(tlang().admin)

   const countryCode = code.split(' ')[0]
   const participants = context.metadata.participants || []
   let userList = `List of users with ${countryCode} country code:\n`

   participants.forEach((participant) => {
    if (participant.id.startsWith(countryCode)) {
     userList += `${participant.id.split('@')[0]}\n`
    }
   })

   if (!userList.trim()) {
    userList = `No users with ${countryCode} country code.`
   }

   await context.reply(userList)
  } catch (error) {
   await context.error(error, "Can't fetch users data due to error, Sorry!!")
  }
 }
)

bot(
 {
  pattern: 'poll',
  desc: 'Creates a poll in group.',
  category: 'group',
  fromMe: true,
 },
 async (context, details) => {
  try {
   const [question, options] = details.split(';')
   if (options.length < 2) {
    return context.reply('Usage: poll question;option1,option2,option3...')
   }

   const pollOptions = options.split(',').filter((option) => option.trim())
   await context.bot.sendMessage(context.chat, {
    poll: { name: question, values: pollOptions },
   })
  } catch (error) {
   await context.error(error)
  }
 }
)

bot(
 {
  pattern: 'promote',
  desc: 'Promote a user to admin.',
  category: 'group',
 },
 async (context) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isBotAdmin) return context.reply("I'm not an admin here.")
   if (!context.isAdmin) return context.reply(tlang().admin)

   const userToPromote = context.mentionedJid[0] || (context.quoted && context.quoted.sender)
   if (!userToPromote) return context.reply('Please reply/mention a user.')

   await context.bot.groupParticipantsUpdate(context.chat, [userToPromote], 'promote')
   await context.send(`@${userToPromote.split('@')[0]} promoted successfully!`, { mentions: [userToPromote] })
  } catch (error) {
   context.error(`Error: ${error}\nCommand: promote`)
  }
 }
)

bot(
 {
  pattern: 'kick',
  desc: 'Kick a user from the group.',
  category: 'group',
 },
 async (context) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isBotAdmin) return context.reply("I'm not an admin in this group.")
   if (!context.isAdmin) return context.reply(tlang().admin)

   const userToKick = context.quoted?.sender || context.mentionedJid[0]
   if (!userToKick) return context.reply('Please reply/mention a user.')
   if (context.checkBot(userToKick)) return context.reply("I can't kick my creator!")

   await context.bot.groupParticipantsUpdate(context.chat, [userToKick], 'remove')
   await context.send(`@${userToKick.split('@')[0]} kicked successfully!`, { mentions: [userToKick] })
  } catch (error) {
   context.error(`Error: ${error}\nCommand: kick`)
  }
 }
)

bot(
 {
  pattern: 'group',
  desc: 'Display group information.',
  category: 'group',
 },
 async (context) => {
  if (!context.isGroup) return context.reply(tlang().group)
  if (!context.isAdmin && !context.isCreator) return context.reply(tlang().admin)

  try {
   const groupPic = await context.bot.profilePictureUrl(context.chat, 'image').catch(() => THUMB_IMAGE)
   const { id, subject, participants, desc } = context.metadata
   const admins = context.admins.map((admin, index) => `  ${index + 1}. wa.me/${admin.id.split('@')[0]}`).join('\n')
   const owner = context.metadata.owner || context.admins.find((admin) => admin.admin === 'superadmin')?.id || 'not found'

   let groupInfo = `
      *「 GROUP INFO 」*
      *ID:* ${id}
      *Name:* ${subject}
      *Members:* ${participants.length}
      *Owner:* wa.me/${owner.split('@')[0]}
      *Admins:*\n${admins}
      *Description:* ${desc || 'unknown'}
    `

   const extraConfig = isMongodb ? await sck.findOne({ id: context.chat }) : false
   if (extraConfig) {
    groupInfo += `
      *Extra Configurations:*
      *NSFW:* ${extraConfig.nsfw ? '✅' : '❎'}
      *Antilink:* ${extraConfig.antilink ? '✅' : '❎'}
      *Economy:* ${extraConfig.economy ? '✅' : '❎'}
      `
    if (extraConfig.welcome) {
     groupInfo += `
        *Welcome Message:* ${extraConfig.welcometext}
        *Goodbye Message:* ${extraConfig.goodbyetext}
        `
    }
   }

   await context.bot.sendMessage(
    context.chat,
    {
     image: { url: groupPic },
     caption: groupInfo,
    },
    { quoted: context }
   )
  } catch (error) {
   context.error(`Error: ${error}\nPattern: group`)
  }
 }
)

const handleGroupAction = async (ctx, action) => {
 if (!ctx.isGroup) {
  return ctx.reply(tlang().group)
 }

 if (!ctx.isBotAdmin) {
  return ctx.reply(tlang().botAdmin)
 }

 if (!ctx.isCreator && !ctx.isAdmin) {
  return ctx.reply(tlang().admin)
 }

 const isCurrentlyRestricted = ctx.metadata?.restrict
 const isMute = action === 'mute' || action === 'lock'
 const currentState = {
  mute: ctx.metadata?.announce,
  lock: isCurrentlyRestricted,
  unmute: ctx.metadata?.announce,
  unlock: isCurrentlyRestricted,
 }[action]

 if (currentState === isMute) {
  return ctx.reply(`Group is already ${action}d.`)
 }

 const settingMap = {
  mute: 'announcement',
  unmute: 'not_announcement',
  lock: 'locked',
  unlock: 'unlocked',
 }

 try {
  await ctx.bot.groupSettingUpdate(ctx.chat, settingMap[action])
  const message = {
   mute: 'Group has been muted. Only admins can send messages.',
   unmute: 'Group has been unmuted. Everyone can send messages.',
   lock: 'Group settings have been locked. Only admins can modify group settings.',
   unlock: 'Group settings have been unlocked. Everyone can modify group settings.',
  }[action]
  ctx.reply(message)
 } catch (error) {
  ctx.reply('Failed to change group settings. Please try again later.')
  await ctx.error(`${error}\n\ncommand: ${action}`, error)
 }
}

bot(
 {
  pattern: 'mute',
  desc: 'Mutes the group chat',
  category: 'group',
  fromMe: true,
 },
 async (ctx) => {
  await handleGroupAction(ctx, 'mute')
 }
)

bot(
 {
  pattern: 'unmute',
  desc: 'Unmutes the group chat',
  category: 'group',
  fromMe: true,
 },
 async (ctx) => {
  await handleGroupAction(ctx, 'unmute')
 }
)

bot(
 {
  pattern: 'lock',
  desc: 'Locks group settings (only admins can modify)',
  category: 'group',
  fromMe: true,
 },
 async (ctx) => {
  await handleGroupAction(ctx, 'lock')
 }
)

bot(
 {
  pattern: 'unlock',
  desc: 'Unlocks group settings (everyone can modify)',
  category: 'group',
  fromMe: true,
 },
 async (ctx) => {
  await handleGroupAction(ctx, 'unlock')
 }
)
bot(
 {
  pattern: 'tag',
  desc: 'Tags everyone in the group without mentioning their numbers',
  category: 'group',
 },
 async (context, message) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!message && !context.reply_message) {
    return context.reply(`*Example: ${prefix}tag Hi Everyone, How are you Doing*`)
   }
   if (!context.isAdmin && !context.isCreator) return context.reply(tlang().admin)

   const targetMessage = context.reply_message || context
   const text = context.reply_message ? context.reply_message.text : message
   let mediaType = ''
   let content

   if (targetMessage.mtype === 'imageMessage') {
    mediaType = 'image'
    content = await targetMessage.download()
   } else if (targetMessage.mtype === 'videoMessage') {
    mediaType = 'video'
    content = await targetMessage.download()
   } else if (!message && context.quoted) {
    content = context.quoted.text
   } else {
    content = message
   }

   if (!content) return context.send('*_Uhh dear, reply to a message!!!_*')

   await context.send(
    content,
    {
     caption: text,
     mentions: context.metadata.participants.map((p) => p.id),
    },
    mediaType,
    targetMessage
   )
  } catch (error) {
   await context.error(`${error}\n\ncommand: tag`, error)
  }
 }
)

bot(
 {
  pattern: 'tagadmin',
  desc: 'Tags only Admin numbers',
  category: 'group',
 },
 async (context, message) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isAdmin && !context.isCreator) return context.reply(tlang().admin)

   const adminList = context.admins.map((admin) => ` *|  @${admin.id.split('@')[0]}*`).join('\n')
   const tagMessage = `\n▢ Tag by: @${context.sender.split('@')[0]}\n${message ? '≡ Message: ' + message : ''}\n\n*┌─⊷ GROUP ADMINS*\n${adminList}\n*└───────────⊷*\n\n${Config.caption}`.trim()

   await context.bot.sendMessage(context.chat, {
    text: tagMessage,
    mentions: [context.sender, ...context.admins.map((admin) => admin.id)],
   })
  } catch (error) {
   await context.error(`${error}\n\ncommand: tagadmin`, error)
  }
 }
)

bot(
 {
  pattern: 'add',
  desc: 'Add a person to the group',
  category: 'group',
 },
 async (context, message) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isBotAdmin) {
    return context.reply(`*_I'm Not Admin In This Group, ${context.isAstro ? 'Master' : 'Sir'}_*`)
   }
   if (!context.isAdmin) return context.reply(tlang().admin)

   const userId = context.quoted ? context.quoted.sender : context.mentionedJid[0] || message.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
   if (!userId) return context.reply('*_Uhh Dear, Please Provide A User._*')

   try {
    await context.bot.groupParticipantsUpdate(context.chat, [userId], 'add')
    await context.reply('*_User Added to Group!!_*')
    context.react('✨')
   } catch {
    context.react('❌')
    await context.bot.sendMessage(
     userId,
     {
      text: `*_Here's The Group Invite Link!!_*\n\n @${context.sender.split('@')[0]} Wants to add you to the group\n\n*_https://chat.whatsapp.com/${await context.bot.groupInviteCode(context.chat)}_*\n ---------------------------------  \n*_Join If You Feel Free?_*`,
      mentions: [context.sender],
     },
     { quoted: context }
    )
    await context.reply("*_Can't add user, Invite sent in pm_*")
   }
  } catch (error) {
   await context.error(`${error}\n\ncommand: add`, error)
  }
 }
)

bot(
 {
  pattern: 'demote',
  desc: 'Demotes the replied/quoted user from group',
  category: 'group',
 },
 async (context) => {
  try {
   if (!context.isGroup) return context.reply(tlang().group)
   if (!context.isBotAdmin) return context.reply("*_I'm Not Admin In This Group, Idiot_*")
   if (!context.isAdmin) return context.reply(tlang().admin)

   const targetId = context.mentionedJid[0] || (context.reply_message && context.reply_message.sender)
   if (!targetId) return context.reply('*Uhh dear, reply/mention a User*')
   if (context.checkBot(targetId)) return context.reply("*_Huh, I can't demote my creator!!_*")

   try {
    await context.bot.groupParticipantsUpdate(context.chat, [targetId], 'demote')
    await context.reply('*_User demoted successfully!!_*')
   } catch {
    await context.reply('*_Can’t demote user, try manually, Sorry!!_*')
   }
  } catch (error) {
   await context.error(`${error}\n\ncommand: demote`, error)
  }
 }
)

bot(
 {
  pattern: 'del',
  desc: 'Deletes a message from any user',
  category: 'group',
 },
 async (context) => {
  try {
   if (!context.reply_message) return context.reply('*_Please reply to a message!!!_*')

   const message = context.reply_message
   if (message.fromMe && context.isCreator) {
    return message.delete()
   } else if (context.isGroup) {
    if (!context.isBotAdmin) {
     return context.reply("*I can't delete messages without being an Admin.*")
    }
    if (!context.isAdmin) return context.reply(tlang().admin)

    await message.delete()
   } else {
    return context.reply(tlang().owner)
   }
  } catch (error) {
   await context.error(`${error}\n\ncommand: del`, error)
  }
 }
)

bot(
 {
  pattern: 'castmsg',
  desc: 'Bot makes a broadcast in all groups',
  fromMe: true,
  category: 'group',
 },
 async (context, text) => {
  try {
   if (!text) {
    return await context.reply('*_Please provide text to broadcast in all groups_*')
   }

   const groups = await context.bot.groupFetchAllParticipating()
   const groupIds = Object.values(groups).map((group) => group.id)

   await context.send(`*_Sending Broadcast To ${groupIds.length} Group Chats. Estimated Time: ${groupIds.length * 1.5} seconds_*`)

   const broadcastMessage = `*--❗${tlang().title} Broadcast❗--*\n\n*🍀Message:* ${text}`
   const messageOptions = {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
     title: 'Suhail-Md Broadcast',
     body: context.senderName,
     renderLargerThumbnail: true,
     thumbnail: log0,
     mediaType: 1,
     sourceUrl: gurl,
     showAdAttribution: true,
    },
   }

   for (const groupId of groupIds) {
    try {
     await sleep(1500)
     await send(context, broadcastMessage, { contextInfo: messageOptions }, '', '', groupId)
    } catch (error) {
     console.error(`Error sending to group ${groupId}:`, error)
    }
   }

   return await context.reply(`*Broadcast sent to ${groupIds.length} groups successfully*`)
  } catch (error) {
   await context.error(`${error}\n\ncommand: broadcast`, error)
  }
 }
)
