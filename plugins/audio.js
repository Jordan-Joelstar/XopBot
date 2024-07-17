const { smd } = require("../lib");
const { exec } = require("child_process");
const fs = require("fs");
async function audioEditor(message, effect = "bass", prefix = "") {
 try {
  if (!message.quoted || !/audio/.test(message.quoted.mtype || message.mtype)) {
   return await message.send("_Reply Audio/Voice Note Only!_");
  }

  // Define the default filter
  let filter = "-af equalizer=f=54:width_type=o:width=2:g=20";

  // Apply different effects based on the 'effect' parameter
  switch (effect) {
   case "bass":
    filter = "-af equalizer=f=54:width_type=o:width=2:g=20";
    break;
   case "blown":
    filter = "-af acrusher=.1:1:64:0:log";
    break;
   case "deep":
    filter = "-af atempo=4/4,asetrate=44500*2/3";
    break;
   case "earrape":
    filter = "-af volume=12";
    break;
   case "fast":
    filter = '-filter:a "atempo=1.63,asetrate=44100"';
    break;
   case "fat":
    filter = '-filter:a "atempo=1.6,asetrate=22100"';
    break;
   case "nightcore":
    filter = "-filter:a atempo=1.06,asetrate=44100*1.25";
    break;
   case "reverse":
    filter = '-filter_complex "areverse"';
    break;
   case "robot":
    filter = "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"";
    break;
   case "slow":
    filter = '-filter:a "atempo=0.7,asetrate=44100"';
    break;
   case "smooth":
    filter = "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"";
    break;
   case "tupai":
    filter = '-filter:a "atempo=0.5,asetrate=65100"';
    break;
   default:
    filter = "-af equalizer=f=54:width_type=o:width=2:g=20"; // Default to 'bass' if effect not recognized
    break;
  }

  // Download and save the audio message
  let downloadedAudio = await message.bot.downloadAndSaveMediaMessage(message.quoted);
  let outputFilename = "temp/" + (message.sender.slice(6) + effect) + ".mp3";

  // Execute ffmpeg command to apply the filter
  exec("ffmpeg -i " + downloadedAudio + " " + filter + " " + outputFilename, async (error, stdout, stderr) => {
   try {
    // Delete the downloaded audio file
    fs.unlinkSync(downloadedAudio);
   } catch (err) {
    console.error("Error deleting downloaded audio:", err);
   }

   if (error) {
    return message.error(error);
   } else {
    // Read the processed audio file
    let processedAudio = fs.readFileSync(outputFilename);

    // Delete the temporary processed audio file
    try {
     fs.unlinkSync(outputFilename);
    } catch (err) {
     console.error("Error deleting processed audio file:", err);
    }

    // Prepare context info
    let contextInfo = {
     ...(await message.bot.contextInfo("Hello " + message.senderName + " 🤍", "⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ⇆")),
    };

    // Send the processed audio message
    return message.bot.sendMessage(
     message.chat,
     {
      audio: processedAudio,
      mimetype: "audio/mpeg",
      ptt: /ptt|voice/.test(message.test || "") ? true : false,
      contextInfo: contextInfo,
     },
     {
      quoted: message,
      messageId: message.bot.messageId(),
     }
    );
   }
  });
 } catch (err) {
  await message.error(err + "\n\ncmdName : " + effect + "\n");
  console.error("./lib/asta.js/audioEditor()\n", err);
 }
}

// Define a function to handle each audio effect command
async function handleAudioEffectCommand(message, effectName) {
 try {
  return await audioEditor(message, effectName, message);
 } catch (error) {
  return await message.error(error + " \n\nCommand: " + effectName, error);
 }
}

smd(
 {
  cmdname: "bass",
  info: "adds bass in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "blown",
  info: "adds blown in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "deep",
  info: "adds deep in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "earrape",
  info: "adds earrape in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "fast",
  info: "adds fast in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "fat",
  info: "adds fat in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "nightcore",
  info: "adds nightcore in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "reverse",
  info: "adds reverse in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "robot",
  info: "adds robot in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "slow",
  info: "adds slow in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "smooth",
  info: "adds smooth in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);

smd(
 {
  cmdname: "tupai",
  info: "adds tupai in given sound",
  type: "audio",
 },
 async (message, params, { smd }) => {
  return await handleAudioEffectCommand(message, smd);
 }
);
