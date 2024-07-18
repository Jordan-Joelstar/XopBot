const moment = require("moment-timezone");
const { bot, updateProfilePicture, parsedJid, tlang, bot_, userdb, tlang, parsedJid, sleep, Config, prefix } = require("../lib");
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

const { profilePictureUrl } = require("@whiskeysockets/baileys");
const config = require("../config");

bot(
 {
  pattern: "getpp",
  desc: "Get profile picture for given user",
  type: "whatsapp",
 },
 async (context) => {
  try {
   // Determine the user JID (Jabber ID)
   const userJid = context.reply_message ? context.reply_message.sender : context.mentionedJid[0] || context.from;

   // Attempt to fetch the profile picture URL
   const profilePicUrl = await getUserProfilePicture(userJid, context.bot);

   // Send the profile picture to the chat
   return await context.bot.sendMessage(context.chat, { image: { url: profilePicUrl } }, { quoted: context });
  } catch (error) {
   await context.error(`${error}\n\nCommand: getpp`, error);
  }
 }
);

async function getUserProfilePicture(jid, sock) {
 try {
  // Attempt to get the high-resolution picture
  const ppUrl = await profilePictureUrl(jid, "image", sock);
  return ppUrl;
 } catch (error) {
  console.error("Error fetching profile picture:", error);
  // Return a default image URL if unable to fetch the profile picture
  return "https://telegra.ph/file/93f1e7e8a1d7c4486df9e.jpg";
 }
}

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
bot(
 {
  pattern: "newgc",
  info: "Create New Group",
  type: "whatsapp",
 },
 async (message, args, { smd, cmdname: cmd }) => {
  try {
   if (!message.isCreator) {
    return message.reply(tlang().owner);
   }
   if (!args) {
    return await message.reply("_Provide Name and Tag User!_");
   }

   let groupName = args;
   let participants = [message.sender];
   if (message.quoted) {
    participants.push(message.quoted.sender);
   }
   if (message.mentionedJid && message.mentionedJid[0]) {
    participants.push(...message.mentionedJid);
    try {
     mentionJids.forEach((mention) => {
      var userId = mention.split("@")[0].trim();
      groupName = groupName.replace(new RegExp("@" + userId, "g"), "");
     });
    } catch {}
   }
   const limitedGroupName = groupName.substring(0, 60);

   const groupInfo = await message.bot.groupCreate(limitedGroupName, [...participants]);

   if (groupInfo) {
    let welcomeMessage = "_Welcome Sir!_";
    let welcomeMsgSent = await message.bot.sendMessage(groupInfo.id, { text: welcomeMessage });
    try {
     var inviteCode = await message.bot.groupInviteCode(groupInfo.id);
    } catch {
     var inviteCode = false;
    }
    var inviteLink = "https://chat.whatsapp.com/" + inviteCode;
    return await send(message, ("*_Hurray, New group created!!!_*\n" + (inviteCode ? "*_" + inviteLink + "_*" : "")).trim(), "", welcomeMsgSent);
   } else {
    await message.send("_Failed_");
   }
  } catch (error) {
   await message.error(error + "\n\ncommand: " + cmd, error);
  }
 }
);
bot(
 {
  pattern: "join",
  info: "joins group by link",
  type: "whatsapp",
  fromMe: true,
 },
 async (message, args) => {
  try {
   if (message.reply_message && message.reply_message.groupInvite) {
    var joinResponse = await message.bot.groupAcceptInviteV4(message.chat, message.reply_message.msg);
    if (joinResponse && joinResponse.includes("joined to:")) {
     return await send(message, "*_Joined_*", {}, "", message);
    }
   }
   let groupLink = args ? args : message.reply_text;
   const groupPattern = /https:\/\/chat\.whatsapp\.com\/([^\s]+)/;
   const match = groupLink.match(groupPattern);

   if (!match) {
    return await message.reply("*_Uhh Please, provide group link_*");
   }
   let groupId = match[1].trim();

   await message.bot
    .groupAcceptInvite(groupId)
    .then((response) => send(message, "*_Joined_*", {}, "", message))
    .catch((error) => message.send("*_Can't Join, Group Id not found!!_*"));
  } catch (error) {
   await message.error(error + "\n\ncommand: join", error);
  }
 }
);

bot(
 {
  pattern: "jidsgc",
  desc: "Sends chat id of every groups.",
  category: "whatsapp",
 },
 async (message, match, { cmdName }) => {
  try {
   if (!message.isCreator) {
    return message.reply(tlang().owner);
   }
   let groups = await message.bot.groupFetchAllParticipating();
   const groupList = Object.values(groups);

   let response = "";
   let showJids = false;
   let showNames = false;
   if (match.includes("jid")) {
    showJids = true;
   } else if (match.includes("name")) {
    showNames = true;
   }
   await message.reply("Fetching " + (showJids ? "Only jids" : showNames ? "Only Names" : "Names and Jids") + " from " + groupList.length + " Groups");
   await sleep(2000);
   for (let group of groupList) {
    response += showJids ? "" : "\n*Group:* " + group.subject + " ";
    response += showNames ? "" : "\n*JID:* " + group.id + "\n";
   }
   return await message.send(response);
  } catch (error) {
   // Handle errors
   await message.error(error + "\n\ncommand: " + cmdName, error);
  }
 }
);
bot(
 {
  pattern: "autobio",
  fromMe: true,
  desc: "Auto Bio Change",
  type: "WhatsApp",
 },
 async (message, input) => {
  try {
   let bio = (await bot_.findOne({ id: `bot_${message.user}` })) || (await bot_.new({ id: `bot_${message.user}` }));

   if (!input) {
    const statusMessage = bio.autobio === "false" ? `_Auto Bio Disabled_` : `_Auto Bio Enabled_`;

    return await message.send(`_${statusMessage}_\n_Auto Bio Can Be Set To, @rizz, @time, @quotes_\n`);
   }

   const command = input.toLowerCase().split(" ")[0].trim();

   if (["off", "disable"].includes(command)) {
    if (abioJob) abioJob.stop();
    isStartAutoBio = false;
    if (bio.autobio === "false") return await message.reply("_Auto Bio Disabled_");

    await bot_.updateOne({ id: `bot_${message.user}` }, { autobio: "false" });
    return await message.reply("_Auto Set Disabled_");
   } else {
    await bot_.updateOne({ id: `bot_${message.user}` }, { autobio: input });
    const bioContent = await getContent(message, input === "true" || input === "on" ? "ᴀᴜᴛᴏʙɪᴏ ᴛɪᴍᴇ ɴᴏᴡ:@time" : input);
    await message.bot.updateProfileStatus(bioContent);
    return await message.reply(`_Bio Set:_ ${bioContent}\n\n_Bio Updates Every Mins_\n`);
   }
  } catch (error) {
   await message.error(`${error}\n\nCommand: autobio`, error);
  }
  bio = false;
 }
);

bot({ on: "text" }, async (message) => {
 bio = bio || (await bot_.findOne({ id: `bot_${message.user}` }));
 if (bio && bio.autobio && typeof bio.autobio === "string" && bio.autobio !== "false") {
  if (!isStartAutoBio) {
   isStartAutoBio = true;
   abioJob = cron.schedule(
    "*/1 * * * *",
    async () => {
     try {
      const bioContent = await getContent(message, bio.autobio === "true" || bio.autobio === "on" ? "ᴀᴜᴛᴏʙɪᴏ ᴛɪᴍᴇ ɴᴏᴡ:@time" : bio.autobio);
      if (bioContent && bioContent !== "false") {
       await message.bot.updateProfileStatus(bioContent);
      }
     } catch (error) {
      console.log(error);
     }
    },
    {
     scheduled: true,
     timezone: config.TIME_ZONE,
    }
   );
  }
 }
});
smd(
 {
  pattern: "permit",
  fromMe: true,
  desc: "Enable/disable PM permit",
  type: "whatsapp",
 },
 async (message, input, { cmdName }) => {
  try {
   const botData = (await bot_.findOne({ id: `bot_${message.user}` })) || (await bot_.new({ id: `bot_${message.user}` }));
   if (!input) {
    const status = botData.permit ? "enabled" : "disabled";
    return await message.send(`*PmPermit Currently ${status}!!!*\n*Set to:* \`\`\`${botData.values.toUpperCase()}\`\`\`\n\n*Available Cmds:* \`\`\`\n${prefix}${cmdName} off\n${prefix}${cmdName} on | all\n${prefix}${cmdName} on | 212,91\`\`\`\n\n${Config.caption}`);
   }

   const [command, values] = input.toLowerCase().trim().split("|");
   const permittedNumbers = values
    ? values.startsWith("all")
      ? "all"
      : values
         .split(",")
         .map((num) => parseInt(num))
         .filter((num) => !isNaN(num))
         .join(",")
    : botData.permit_values;

   if (["on", "enable", "act"].includes(command)) {
    if (botData.permit && botData.permit_values === permittedNumbers) {
     return await message.send("*_Already Enabled_*");
    }
    await bot_.updateOne({ id: `bot_${message.user}` }, { permit: true, permit_values: permittedNumbers });
    return await message.send(`*_PmPermit ${botData.permit ? "Updated" : "Activated"}_*\n*_Now ${permittedNumbers === "all" ? "everyone" : permittedNumbers} need permission for PM_*`);
   } else if (["off", "disable"].includes(command)) {
    if (!botData.permit) {
     return await message.send("*_Already Disabled_*");
    }
    await bot_.updateOne({ id: `bot_${message.user}` }, { permit: false });
    return await message.send("*_Disabled Now!_*");
   } else {
    return await message.bot.sendMessage(message.chat, {
     text: `*PmPermit Currently ${botData.permit ? "enabled" : "disabled"}!*`,
    });
   }
  } catch (error) {
   await message.error(`${error}\n\nCommand: ${cmdName}`, error);
  }
 }
);

bot(
 {
  pattern: "approve",
  fromMe: true,
  desc: "Approves that person for PM",
  type: "whatsapp",
 },
 async (message) => {
  try {
   const botData = (await bot_.findOne({ id: `bot_${message.user}` })) || (await bot_.new({ id: `bot_${message.user}` }));
   if (!botData.permit) {
    return await message.sendMessage(message.chat, {
     text: "*_Enable Permit First!_*",
    });
   }
   if (!message.quoted) {
    return message.reply("_Reply A User_");
   }
   const userData = (await userdb.findOne({ id: message.quoted.sender })) || (await userdb.new({ id: message.quoted.sender }));
   if (userData.permit === "true") {
    return message.reply(`*_ ${userData.name || "User"} already has permission for PM._*`);
   }
   await userdb.updateOne({ id: message.quoted.sender }, { permit: "true", times: 0 });
   return message.send(`*_Permitted ${userData.name || "User"} for PM._*`);
  } catch (error) {
   return await message.error(`${error}\n\nCommand: approve`, error);
  }
 }
);

bot(
 {
  pattern: "disapprove",
  fromMe: true,
  desc: "Disapproves user for PM.",
  type: "whatsapp",
 },
 async (message) => {
  try {
   const botData = (await bot_.findOne({ id: `bot_${message.user}` })) || (await bot_.new({ id: `bot_${message.user}` }));
   if (!botData.permit) {
    return await message.sendMessage(message.chat, {
     text: "*_Permit Disabled, Enable First!_*",
    });
   }
   if (!message.quoted) {
    return message.send("*Please reply to a user for action.*");
   }
   const userData = (await userdb.findOne({ id: message.quoted.sender })) || (await userdb.new({ id: message.quoted.sender }));
   await userdb.updateOne({ id: message.quoted.sender }, { permit: "false" });
   return message.send(`*_Revoked permission of ${userData.name || "User"} for PM._*`);
  } catch (error) {
   await message.error(`${error}\nCommand: disapprove`, error);
  }
 }
);
