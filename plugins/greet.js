const axios = require("axios");
const { fetchJson, runtime, Config } = require("../lib/index");
const { bot } = require("../lib/plugins");
const { groupdb } = require("../lib/schemes");
const { tlang } = require("../lib/scraper");

async function sendWelcome(context, welcomeMessage = "", buttons = "", mentionedJids = "", messageType = "msg", includeContextInfo = false) {
 try {
  if (!welcomeMessage) return;

  let formattedMessage = welcomeMessage;

  if (context.isGroup) {
   formattedMessage = formattedMessage
    .replace(/@gname|&gname/gi, context.metadata.subject)
    .replace(/@desc|&desc/gi, context.metadata.desc)
    .replace(/@count|&count/gi, context.metadata.participants.length);
  }

  formattedMessage = formattedMessage
   .replace(/@user|&user/gi, "@" + context.senderNum)
   .replace(/@name|&name/gi, context.senderName || "_")
   .replace(/@time|&time/gi, context.time)
   .replace(/@date|&date/gi, context.date)
   .replace(/@bot|&bot/gi, Config.botname)
   .replace(/@owner|&owner/gi, Config.ownername)
   .replace(/@caption|&caption/gi, caption)
   .replace(/@gurl|@website|&gurl|&website|@link|&link/gi, gurl)
   .replace(/@runtime|&runtime|@uptime|&uptime/gi, runtime(process.uptime()))
   .trim();

  try {
   const pickupLine = await fetchJson("https://api.popcat.xyz/pickuplines");
   formattedMessage = formattedMessage.replace(/@line|&line/gi, pickupLine.pickupline || "");
  } catch (error) {
   formattedMessage = formattedMessage.replace(/@line|&line/gi, "");
  }

  try {
   if (/@quote|&quote/gi.test(formattedMessage)) {
    const { data: quoteData } = await axios.get("https://favqs.com/api/qotd");
    if (quoteData && quoteData.quote) {
     formattedMessage = formattedMessage.replace(/@quote|&quote/gi, quoteData.quote.body || "").replace(/@author|&author/gi, quoteData.quote.author || "");
    }
   }
  } catch (error) {
   formattedMessage = formattedMessage.replace(/@quote|&quote|@author|&author/gi, "");
  }

  if (messageType === "msg" || !messageType) {
   try {
    if (typeof mentionedJids === "string") {
     mentionedJids = mentionedJids.split(",");
    }
    if (/@user|&user/g.test(welcomeMessage) && !mentionedJids.includes(context.sender)) {
     mentionedJids.push(context.sender);
    }
   } catch (error) {
    console.log("ERROR : ", error);
   }

   const contextInfo = {
    ...(includeContextInfo || /@context|&context/g.test(welcomeMessage) ? await context.bot.contextInfo(Config.botname, context.pushName) : {}),
    mentionedJid: mentionedJids,
   };

   if (/@pp/g.test(welcomeMessage)) {
    return await context.send(
     await context.getpp(),
     {
      caption: formattedMessage,
      mentions: mentionedJids,
      contextInfo: contextInfo,
     },
     "image",
     buttons
    );
   } else if (context.jid && /@gpp/g.test(welcomeMessage)) {
    return await context.send(
     await context.getpp(context.jid),
     {
      caption: formattedMessage,
      mentions: mentionedJids,
      contextInfo: contextInfo,
     },
     "image",
     buttons
    );
   } else {
    return await context.send(
     formattedMessage,
     {
      mentions: mentionedJids,
      contextInfo: contextInfo,
     },
     buttons
    );
   }
  } else {
   return formattedMessage;
  }
 } catch (error) {
  console.log(error);
 }
}

bot(
 {
  pattern: "welcome",
  desc: "sets welcome message in specific group.",
  category: "group",
 },
 async (context, args) => {
  await handleGroupMessage(context, args, "welcome");
 }
);

bot(
 {
  pattern: "goodbye",
  desc: "sets goodbye message in specific group.",
  category: "group",
 },
 async (context, args) => {
  await handleGroupMessage(context, args, "goodbye");
 }
);

async function handleGroupMessage(context, args, messageType) {
 try {
  if (!context.isGroup) {
   return context.reply(tlang().group);
  }
  if (!context.isAdmin && !context.isCreator) {
   return context.reply(tlang().admin);
  }

  const command = args.toLowerCase().trim();
  const groupData = (await groupdb.findOne({ id: context.chat })) || (await groupdb.new({ id: context.chat }));
  const isWelcome = messageType === "welcome";
  const dbField = isWelcome ? "welcome" : "goodbye";
  const textField = isWelcome ? "welcometext" : "goodbyetext";

  if (["on", "act", "enable"].includes(command)) {
   if (groupData[dbField] === "true") {
    return await context.send(`*_${messageType} already enabled in current group!!_*`);
   }
   await groupdb.updateOne({ id: context.chat }, { [dbField]: "true" });
   return await context.send(`*${messageType} successfully enabled!!*`);
  }

  if (groupData[dbField] !== "true") {
   return await context.send(`*_${messageType} *Disabled in this Group!_* \n*_Use on/off to enable/disable ${messageType}_*`);
  }

  if (!args || command === "get") {
   return await context.reply(`*${messageType} :* ${groupData[textField]}`);
  }

  if (["off", "disable"].includes(command)) {
   if (groupData[dbField] === "false") {
    return await context.send(`*_${messageType} already disabled in current group!!_*`);
   }
   await groupdb.updateOne({ id: context.chat }, { [dbField]: "false" });
   return await context.send(`*${messageType} message disabled!!*`);
  }

  await groupdb.updateOne(
   { id: context.chat },
   {
    [textField]: args,
    [dbField]: "true",
   }
  );
  await sendWelcome(context, args);
 } catch (error) {
  context.error(`${error}\n\ncommand: set${messageType}`, error);
 }
}
