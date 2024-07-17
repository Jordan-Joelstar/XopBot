const moment = require("moment-timezone");
const { bot, updateProfilePicture, parsedJid } = require("../lib");
const messageTypes = ["imageMessage"];

bot(
 {
  pattern: "pp",
  desc: "Set profile picture",
  type: "whatsapp",
  fromMe: true,
 },
 async (message) => {
  try {
   const targetMessage = messageTypes.includes(message.mtype) ? message : message.reply_message;
   if (!targetMessage || !messageTypes.includes(targetMessage?.mtype || "need_Media")) {
    return await message.reply("_Reply Image_");
   }
   return await updateProfilePicture(message, message.user, targetMessage, "pp");
  } catch (error) {
   await message.error(`${error}\n\ncommand : pp`, error);
  }
 }
);

bot(
 {
  pattern: "fullpp",
  desc: "Set full screen profile picture",
  type: "whatsapp",
  fromMe: true,
 },
 async (message) => {
  try {
   const targetMessage = messageTypes.includes(message.mtype) ? message : message.reply_message;
   if (!targetMessage || !messageTypes.includes(targetMessage?.mtype || "need_Media")) {
    return await message.reply("_Reply Horizontal Image_");
   }
   return await updateProfilePicture(message, message.user, targetMessage, "fullpp");
  } catch (error) {
   await message.error(`${error}\n\ncommand : fullpp`, error);
  }
 }
);

bot(
 {
  pattern: "rpp",
  desc: "Remove profile picture",
  type: "whatsapp",
  fromMe: true,
 },
 async (message) => {
  try {
   await message.removepp();
   await message.send("*_Removed Profile Picture!_*");
  } catch (error) {
   await message.error(`${error}\n\ncommand : rpp`, error);
  }
 }
);

bot(
 {
  pattern: "bio",
  desc: "Update profile status of WhatsApp",
  type: "whatsapp",
  fromMe: true,
 },
 async (message, text) => {
  try {
   if (!text) {
    return await message.send("_Need Text_");
   }
   await message.bot.updateProfileStatus(text);
   await message.send("_Bio Updated!_");
  } catch (error) {
   await message.error(`${error}\n\ncommand : bio`, error);
  }
 }
);

bot(
 {
  pattern: "ptv",
  desc: "Send ptv Message of video",
  type: "whatsapp",
 },
 async (message) => {
  try {
   if (!message.quoted) {
    return await message.send("_Reply Video!_");
   }
   if (message.quoted.mtype !== "videoMessage") {
    return await message.send("_Reply Video Message!_");
   }
   return await message.bot.forwardOrBroadCast(message.chat, message.quoted, {}, "ptv");
  } catch (error) {
   await message.error(`${error}\n\ncommand : ptv`, error);
  }
 }
);

bot(
 {
  pattern: "quoted",
  desc: "Get reply Message from Replied Message",
  type: "whatsapp",
 },
 async (message) => {
  try {
   if (!message.quoted) {
    return await message.send("_Reply Message!_");
   }
   const quotedMessage = await message.bot.serializeM(await message.getQuotedObj());
   if (!quotedMessage || !quotedMessage.quoted) {
    return await message.reply("_Reply Message With Replied Message!_");
   }
   await message.bot.copyNForward(message.chat, quotedMessage.quoted, false);
  } catch (error) {
   await message.error(`${error}\n\ncommand : quoted`, error);
  }
 }
);

bot(
 {
  pattern: "blocked",
  desc: "Get list of all Blocked Numbers",
  type: "whatsapp",
  fromMe: true,
 },
 async (message) => {
  try {
   const blockedNumbers = await message.bot.fetchBlocklist();
   if (blockedNumbers.length === 0) {
    return await message.reply("No Blocked Numbers Found!.");
   }
   let response = `\n*_YOU BLOCKED:* ${blockedNumbers.length} PEOPLE_\n\n┌─⊷ \t*BLOCKED NUMBERS*\n`;
   blockedNumbers.forEach((number, index) => {
    response += `▢ ${index + 1}:- wa.me/${number.split("@")[0]}\n`;
   });
   response += "└───────────";
   await message.bot.sendMessage(message.chat, { text: response });
  } catch (error) {
   await message.error(`${error}\n\ncommand : blocklist`, error);
  }
 }
);

bot(
 {
  pattern: "chats",
  type: "whatsapp",
  desc: "Finds info about personal chats",
 },
 async (message, _, { store }) => {
  try {
   const personalChats = store.chats.all().filter((chat) => chat.id.endsWith(".net"));
   let response = ` 「  YOUR CHATS  」\n\nTotal ${personalChats.length} CHATS.`;
   personalChats.forEach((chat) => {
    response += `\n\nUser: @${chat.id.split("@")[0]}\nMessages: ${chat.unreadCount}\nLast chat: ${moment(chat.conversationTimestamp * 1000)
     .tz(timezone)
     .format("DD/MM/YYYY HH:mm:ss")}`;
   });
   await message.bot.sendTextWithMentions(message.chat, response, message);
  } catch (error) {
   await message.error(`${error}\n\n command: listpc`, error, "*_Didn't get any results, Sorry!_*");
  }
 }
);

bot(
 {
  pattern: "groups",
  type: "whatsapp",
  desc: "Finds info about all active groups",
 },
 async (message, _, { store, client }) => {
  try {
   const groupChats = store.chats.all().filter((chat) => chat.id.endsWith("@g.us"));
   let response = ` 「  YOUR GROUPS  」\n\nTotal ${groupChats.length} GROUPS!`;
   for (const chat of groupChats) {
    const metadata = await client.groupMetadata(chat.id);
    response += `\n\nName: ${metadata.subject}\nOwner: @${metadata.owner.split("@")[0]}\nID: ${chat.id}\nMade: ${moment(metadata.creation * 1000)
     .tz("Asia/Kolkata")
     .format("DD/MM/YYYY HH:mm:ss")}\nMembers: ${metadata.participants.length}\nMessages: ${chat.unreadCount}\nDescription: ${metadata.desc ? metadata.desc : "No description"}`;
   }
   await message.bot.sendTextWithMentions(message.chat, response, message);
  } catch (error) {
   await message.error(`${error}\n\n command: listgc`, error);
  }
 }
);

bot(
 {
  pattern: "vcard",
  desc: "Create Contact by given name.",
  type: "whatsapp",
 },
 async (message, name) => {
  try {
   if (!message.quoted) {
    return message.reply("_Reply User With Name!_");
   }
   if (!name) {
    return message.reply("_You Tagged, Now Add Name!_");
   }
   const nameParts = name.split(" ");
   if (nameParts.length > 3) {
    name = nameParts.slice(0, 3).join(" ");
   }
   const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:;\nTEL;type=CELL;type=VOICE;waid=${message.quoted.sender.split("@")[0]}:+${owner[0]}\nEND:VCARD`;
   const contact = {
    contacts: {
     displayName: name,
     contacts: [{ vcard }],
    },
   };
   return await message.bot.sendMessage(message.chat, contact, { quoted: message });
  } catch (error) {
   await message.error(`${error}\n\ncommand : vcard`, error);
  }
 }
);

bot(
 {
  pattern: "edit",
  fromMe: true,
  desc: "Edit message that was sent by bot",
  type: "whatsapp",
 },
 async (message, text) => {
  try {
   const originalMessage = message.reply_message && message.reply_message.fromMe ? message.reply_message : false;
   if (!originalMessage) {
    return await message.reply("_Reply Your Message!_");
   }
   if (!text) {
    return await message.reply("_Put Text To Replace!_");
   }
   return await message.edit(text, { edit: originalMessage });
  } catch (error) {
   await message.error(`${error}\n\ncommand : edit`, error);
  }
 }
);

bot(
 {
  pattern: "forward",
  desc: "Forward your messages to a jid",
  type: "whatsapp",
 },
 async (message, jidString) => {
  try {
   if (!message.reply_message) {
    return message.reply("_Reply A Message_");
   }
   const jids = await parsedJid(jidString);
   if (!jids || !jids[0]) {
    return await message.send(`_Give Me JID to foward to!_`);
   }
   for (const jid of jids) {
    await message.bot.forwardOrBroadCast(jid, message.reply_message);
   }
  } catch (error) {
   await message.error(`${error}\n\ncommand : forward`, error);
  }
 }
);

bot(
 {
  pattern: "block",
  info: "Blocks a person",
  fromMe: true,
  type: "whatsapp",
 },
 async (message) => {
  try {
   const targetUser = message.reply_message ? message.reply_message.sender : !message.isGroup ? message.from : message.mentionedJid[0] ? message.mentionedJid[0] : "";
   if (!targetUser || !targetUser.includes("@s.whatsapp.net")) {
    return await message.reply("_Reply A User_");
   }
   if (message.checkBot(targetUser)) {
    return await message.reply("_Can't Block Dev!_");
   }
   await message.bot
    .updateBlockStatus(targetUser, "block")
    .then(() => {
     message.react("✨", message);
    })
    .catch(() => message.reply("_Seems User is Already Blocked_"));
  } catch (error) {
   await message.error(`${error}\n\ncommand: block`, error, false);
  }
 }
);

bot(
 {
  pattern: "unblock",
  info: "Unblocks a user.",
  type: "whatsapp",
  fromMe: true,
 },
 async (message) => {
  try {
   const targetUser = message.reply_message ? message.reply_message.sender : !message.isGroup ? message.from : message.mentionedJid[0] ? message.mentionedJid[0] : "";
   if (!targetUser || !targetUser.includes("@s.whatsapp.net")) {
    return await message.reply("_Reply A User_");
   }
   await message.bot
    .updateBlockStatus(targetUser, "unblock")
    .then(() => {
     message.send(`*@${targetUser.split("@")[0]} Unblocked Successfully..!*`, { mentions: [targetUser] });
    })
    .catch(() => message.reply("*_User Wasn't Blocked_"));
  } catch (error) {
   await message.error(`${error}\n\ncommand: unblock`, error);
  }
 }
);

bot(
 {
  pattern: "vv",
  desc: "Download viewOnce message.",
  type: "whatsapp",
 },
 async (message, query) => {
  try {
   let viewOnceMessage = false;
   if (message.reply_message) {
    if (message.reply_message.viewOnce || (message.device === "ios" && /audioMessage|videoMessage|imageMessage/.test(message.reply_message.mtype))) {
     viewOnceMessage = message.reply_message;
    }
   }
   viewOnceMessage.mtype = viewOnceMessage.mtype2;
   if (!viewOnceMessage) {
    return message.reply("_Reply A ViewOnce Message_");
   }
   const quotedMessage = {
    key: viewOnceMessage.key,
    message: {
     conversation: "```DOWNLOADED```",
    },
   };
   const mediaPath = await message.bot.downloadAndSaveMediaMessage(viewOnceMessage.msg);
   await message.bot.sendMessage(
    message.jid,
    {
     [viewOnceMessage.mtype2.split("Mess")[0]]: {
      url: mediaPath,
     },
     caption: viewOnceMessage.body,
    },
    { quoted: quotedMessage }
   );
  } catch (error) {
   await message.error(`${error}\n\ncommand: vv`, error);
  }
 }
);
bot(
 {
  pattern: "jid",
  desc: "Get JID of all users in a group.",
  type: "whatsapp",
 },
 async ({ jid: groupJid, reply: sendReply, quoted: quotedMessage }) => {
  const userJid = quotedMessage ? quotedMessage.sender : groupJid;
  return sendReply(userJid);
 }
);

bot(
 {
  pattern: "getpp",
  desc: "Get profile picture for given user",
  type: "whatsapp",
 },
 async (context) => {
  try {
   const userJid = context.reply_message ? context.reply_message.sender : context.mentionedJid[0] || context.from;
   const profilePicUrl = await context.bot.profilePictureUrl(userJid, "image").catch(() => "Profile Pic Not Fetched");
   return await context.bot.sendMessage(
    context.chat,
    {
     image: { url: profilePicUrl },
    },
    { quoted: context }
   );
  } catch (error) {
   await context.error(`${error}\n\ncommand : getpp`, error);
  }
 }
);

bot(
 {
  pattern: "about",
  desc: "Get information about a user.",
  type: "whatsapp",
 },
 async (context) => {
  try {
   const userJid = context.reply_message ? context.reply_message.sender : context.mentionedJid[0] || false;
   if (!userJid && context.isGroup) {
    const groupMetadata = context.metadata;
    const groupOwner = groupMetadata.owner || context.admins.find((admin) => admin.admin === "superadmin")?.id || "notFound";
    const groupAdmins = context.admins.map((admin, index) => `  ${index + 1}. wa.me/${admin.id.split("@")[0]}`).join("\n");
    const groupProfilePic = await context.bot.profilePictureUrl(context.chat, "image").catch(() => "https://telegra.ph/file/29a8c892a1d18fdb26028.jpg");
    const groupInfo = `
「 GROUP INFO 」
*NAME :*  • ${groupMetadata.subject}
*Members :* • ${groupMetadata.participants.length}
*Group Owner :* • ${groupOwner ? `wa.me/${groupOwner.split("@")[0]}` : "notFound"}
*Admins :* ${groupAdmins}
*Description:* • ${groupMetadata.desc?.toString()}
`;
    return await context.reply(groupProfilePic, { caption: groupInfo }, "image");
   } else if (userJid) {
    const { status: userStatus, setAt: statusSetAt } = await context.bot.fetchStatus(userJid).catch(() => ({ status: "undefined", setAt: "" }));
    const userProfilePic = await context.bot.profilePictureUrl(userJid, "image").catch(() => "https://telegra.ph/file/29a8c892a1d18fdb26028.jpg");
    const userName = await context.bot.getName(userJid);
    const userJidShort = userJid.split("@")[0];
    const statusSetAtFormatted = statusSetAt.toString().split(" ").slice(0, 5).join(" ");
    const userInfo = `
「 PERSON INFO 」
*NAME:* ${userName}
*NUMBER:* ${userJidShort}
*BIO:* ${userStatus}
*LAST EDITED:* ${statusSetAtFormatted}
`;
    return await context.bot.sendMessage(
     context.jid,
     {
      image: { url: userProfilePic },
      caption: userInfo,
     },
     { quoted: context }
    );
   } else {
    return context.reply("*_Reply A User_*");
   }
  } catch (error) {
   await context.error(`${error}\n\ncommand : whois`, error);
  }
 }
);

bot(
 {
  pattern: "wa",
  desc: "Get wa.me link for quoted or mentioned user.",
  type: "whatsapp",
 },
 async (context) => {
  try {
   const userJid = context.reply_message ? context.reply_message.sender : context.mentionedJid[0] || false;
   const waLink = userJid ? `https://wa.me/${userJid.split("@")[0]}` : "_Reply Or Mention A User_";
   await context.reply(waLink);
  } catch (error) {
   await context.error(`${error}\n\ncommand : wa`, error, false);
  }
 }
);

bot(
 {
  pattern: "wame",
  desc: "Get wa.me link for the user.",
  type: "whatsapp",
 },
 async (context) => {
  try {
   const waLink = `https://wa.me/${context.sender.split("@")[0]}`;
   await context.reply(waLink);
  } catch (error) {
   await context.error(`${error}\n\ncommand : mee`, error);
  }
 }
);
