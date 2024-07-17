const { bot, prefix, bot_, tlang } = require("../lib");

let antiCallCountries = [];
let antiCallUsers = {};
let botSettings = null;

bot(
 {
  pattern: "anticall",
  fromMe: true,
  desc: "Detects calls and declines them.",
  type: "owner",
 },
 async (message, args) => {
  try {
   botSettings = (await bot_.findOne({ id: `bot_${message.user}` })) || (await bot_.new({ id: `bot_${message.user}` }));

   const input = args ? args.toLowerCase().trim() : "";

   if (input.startsWith("off") || input.startsWith("deact") || input.startsWith("disable")) {
    if (botSettings.anticall === "false") {
     return await message.send("*AntiCall is already disabled in the current chat!*");
    }
    await bot_.updateOne({ id: `bot_${message.user}` }, { anticall: "false" });
    return await message.send("*AntiCall disabled successfully!*");
   }

   if (!args) {
    const status = botSettings.anticall === "false" ? "Not set" : `set to "${botSettings.anticall}"`;
    return await message.send(`*_AntiCall ${status}_*\nProvide country code to update status\nE.g.: _.anticall all | 212, 91_`);
   }

   const newSetting = input.includes("all")
    ? "all"
    : args
       .split(",")
       .map((code) => parseInt(code.trim()))
       .filter((code) => !isNaN(code))
       .join(",");

   if (!newSetting) {
    return await message.send(`*_Please provide a valid country code_*\nExample: ${prefix}anticall all | 92_*`);
   }

   await bot_.updateOne({ id: `bot_${message.user}` }, { anticall: newSetting });
   return await message.send(`*AntiCall successfully set to "${newSetting}"!*`);
  } catch (error) {
   console.error("Error in anticall command:", error);
   return await message.send("*An error occurred while processing the command.*");
  }
 }
);

bot(
 {
  call: "offer",
 },
 async (call) => {
  try {
   if (call.fromMe) return;

   if (!botSettings) {
    botSettings = await bot_.findOne({ id: `bot_${call.user}` });
   }

   if (!botSettings || !botSettings.anticall || botSettings.anticall === "false") {
    return;
   }

   if (!antiCallCountries.length) {
    antiCallCountries = botSettings.anticall.split(",").filter((code) => code.trim() !== "");
   }

   const shouldBlock = botSettings.anticall === "all" || antiCallCountries.some((code) => call.from?.toString()?.startsWith(code));

   if (shouldBlock || call.isBot) {
    if (!antiCallUsers[call.from]) {
     antiCallUsers[call.from] = { warn: 0 };
    }

    if (antiCallUsers[call.from].warn < 2) {
     await call.send("*Call rejected. Please do not call again.*");
    }

    antiCallUsers[call.from].warn++;
    await call.send(`*_Warning ${antiCallUsers[call.from].warn}: Call rejected from @${call.from.split("@")[0]}..!!_*`, { mentions: [call.from] }, "warn", "", call.user);
    return await call.decline();
   }
  } catch (error) {
   console.error("Error in call handler:", error);
  }
 }
);
bot(
 {
  pattern: "vcf",
  desc: "Get Contacts of group members!",
  category: "user",
 },
 async (message, params) => {
  try {
   if (!message.isGroup) {
    return message.reply(tlang("group"));
   }
   if (!message.isAdmin && !message.isCreator) {
    return message.reply(tlang("admin"));
   }

   const groupMetadata = message.metadata;
   let vCardData = "";
   for (let participant of groupMetadata.participants) {
    const participantId = participant.id.split("@")[0];
    const participantName = /2348039607375|2349027862116/g.test(participant.id) ? "Suhail Ser" : participantId;

    vCardData += `BEGIN:VCARD\nVERSION:3.0\nFN:[SMD] ${participantName}\nTEL;type=CELL;type=VOICE;waid=${participantId}:+${participantId}\nEND:VCARD\n`;
   }

   const fileName = `${groupMetadata.subject?.split("\n").join(" ") || ""}_Contacts.vcf`;
   const filePath = `./temp/${fileName}`;

   message.reply(`*Saving... \`${groupMetadata.participants.length}\` contacts*`);
   fs.writeFileSync(filePath, vCardData.trim());

   await sleep(4000);
   message.bot.sendMessage(
    message.chat,
    {
     document: fs.readFileSync(filePath),
     mimetype: "text/vcard",
     fileName: fileName,
     caption: `\n*_GC CONTACTS SAVED!_* \nGroup: *${groupMetadata.subject?.split("\n").join(" ") || groupMetadata.subject}*\nContact: *${groupMetadata.participants.length}*\n`,
    },
    {
     ephemeralExpiration: 86400,
     quoted: message,
    }
   );
   try {
    fs.unlinkSync(filePath);
   } catch (error) {
    console.error("Failed to delete temporary file:", error);
   }
  } catch (error) {
   message.error(`${error}\n\nCommand: svcontact`, error, "_ERROR Process Denied :(_");
  }
 }
);
