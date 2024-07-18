const moment = require("moment-timezone");
const { fetchJson, smd, tlang, prefix, Config } = require("../lib");
let gis = require("async-g-i-s");
const axios = require("axios");
const fetch = require("node-fetch");
smd(
 {
  pattern: "lyrics",
  desc: "Get the lyrics of a song.",
  category: "search",
 },
 async (m, songName) => {
  try {
   if (!songName) {
    return await m.send("*_Please provide a song name!_*");
   }

   const apiUrl = `https://api.maher-zubair.tech/search/lyrics?q=${encodeURIComponent(songName)}`;
   const response = await fetch(apiUrl);

   if (!response.ok) {
    return await m.send(`*_Error: ${response.status} ${response.statusText}_*`);
   }

   const data = await response.json();

   if (data.status !== 200) {
    return await m.send("*_An error occurred while fetching the data._*");
   }

   const { artist, lyrics, title } = data.result;

   const lyricsMessage = `
*Song:* ${title}
*Artist:* ${artist}

${lyrics}
`;

   await m.send(lyricsMessage);
  } catch (e) {
   await m.error(`${e}\n\ncommand: lyrics`, e);
  }
 }
);
smd(
 {
  pattern: "bing",
  desc: "Search on Bing.",
  category: "search",
 },
 async (msg, query) => {
  try {
   if (!query) {
    return await msg.reply("*Please provide a search query.*");
   }

   const apiUrl = `https://api-smd.onrender.com/api/bingsearch?query=${encodeURIComponent(query)}`;
   const response = await fetch(apiUrl).then((res) => res.json());

   if (!response || !response.status) {
    return await msg.reply("*An error occurred while fetching the search results.*");
   }

   const results = response.result;
   let resultText = `*Bing Search Results for "${query}"*\n\n`;

   for (const result of results) {
    resultText += `*Title:* ${result.title}\n*Description:* ${result.description}\n*URL:* ${result.url}\n\n`;
   }

   await msg.reply(resultText);
  } catch (err) {
   await msg.error(err + "\n\ncommand: bing", err, "*An error occurred while searching on Bing.*");
  }
 }
);

smd(
 {
  pattern: "shazam",
  category: "search",
  desc: "Finds info about song",
 },
 async (message) => {
  try {
   let mime = message.reply_message ? message.reply_message.mtype : "";
   if (!/audio/.test(mime)) return message.reply(`Reply audio ${prefix}find`);
   let buff = await message.reply_message.download();
   const { shazam } = require(lib_dir);
   let data = await shazam(buff);
   if (!data || !data.status) return message.send(data);
   let h = `*TITLE: _${data.title}_* \n*ARTIST: _${data.artists}_*\n *ALBUM:* _${data.album}_ `;
   await message.bot.sendUi(message.jid, { caption: h }, { quoted: message }, "text", "true");
  } catch (e) {
   return await message.error(`${e}\n\n command: find`, e, `*_Didn't get any results, Sorry!_*`);
  }
 }
);
//------------------------------------------------------------------------------------

smd(
 {
  pattern: "github",
  category: "search",
  desc: "Finds Details Of Git Repo",
 },
 async (message, match) => {
  try {
   message.react("🔍");
   if (!match) return message.reply(`Give me a user name like ${prefix}github Astropeda`);

   const { data } = await axios(`https://api.github.com/users/${match}`);
   if (!data) return await message.send(`*_Didn't get any results, Provide valid user name!_*`);
   let gitdata = data;
   message.sendMessage(
    message.jid,
    {
     image: { url: gitdata.avatar_url },
     caption: `ㅤㅤㅤ*[ GITHUB USER INFO ]*

🚩 Id : ${gitdata.id}
🔖 Nickname : ${gitdata.name}
🔖 Username : ${gitdata.login}
✨ Bio : ${gitdata.bio}
🏢 Company : ${gitdata.company}
📍 Location : ${gitdata.location}
📧 Email : ${gitdata.email}
📰 Blog : ${gitdata.blog}
🔓 Public Repo : ${gitdata.repos_url}
🔐 Public Gists : ${gitdata.gists_url}
💕 Followers : ${gitdata.followers}
👉 Following : ${gitdata.following}
🔄 Updated At : ${gitdata.updated_at}
🧩 Created At : ${gitdata.created_at}`,
    },
    { quoted: message }
   );
  } catch (e) {
   return await message.error(`${e}\n\n command: github`, e, `*_Didn't get any results, Sorry!_*`);
  }
 }
);

smd(
 {
  pattern: "imdb",
  category: "search",
  desc: "sends info of asked movie/series.",
 },
 async (message, match) => {
  try {
   message.react("🔍");
   if (!match) return message.reply(`_Name a Series or movie ${tlang().greet}._`);
   let { data } = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${match}&plot=full`);
   if (!data || data.cod == "404") return await message.reply(`*_Please provide valid country name!_*`);

   let imdbt = "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n" + " ``` 𝕀𝕄𝔻𝔹 𝕊𝔼𝔸ℝℂℍ```\n" + "⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n";
   imdbt += "🎬Title      : " + data.Title + "\n";
   imdbt += "📅Year       : " + data.Year + "\n";
   imdbt += "⭐Rated      : " + data.Rated + "\n";
   imdbt += "📆Released   : " + data.Released + "\n";
   imdbt += "⏳Runtime    : " + data.Runtime + "\n";
   imdbt += "🌀Genre      : " + data.Genre + "\n";
   imdbt += "👨🏻‍💻Director   : " + data.Director + "\n";
   imdbt += "✍Writer     : " + data.Writer + "\n";
   imdbt += "👨Actors     : " + data.Actors + "\n";
   imdbt += "📃Plot       : " + data.Plot + "\n";
   imdbt += "🌐Language   : " + data.Language + "\n";
   imdbt += "🌍Country    : " + data.Country + "\n";
   imdbt += "🎖️Awards     : " + data.Awards + "\n";
   imdbt += "📦BoxOffice  : " + data.BoxOffice + "\n";
   imdbt += "🏙️Production : " + data.Production + "\n";
   imdbt += "🌟imdbRating : " + data.imdbRating + "\n";
   imdbt += "❎imdbVotes  : " + data.imdbVotes + "\n\n";
   imdbt += Config.caption;
   await message.bot.sendUi(message.jid, { caption: imdbt }, { quoted: message }, "image", data.Poster);
  } catch (e) {
   return await message.error(`${e}\n\n command: ${cmdName}`, e, `*_Uhh dear, Didn't get any results!_*`);
  }
 }
);
//---------------------------------------------------------------------------
smd(
 {
  pattern: "weather",
  category: "search",
  desc: "Sends weather info about asked place.",
 },
 async (message, text) => {
  try {
   if (!text) return message.reply(`*_Give me city name, ${message.isCreator ? "Master" : "Idiot"}!!_*`);
   let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`);
   if (!data || data.cod === "404") return await message.reply(`*_Please provide valid city name!_*`);
   let textw = `*🌟Weather of  ${text}*\n\n`;
   textw += `*Weather:-* ${data.weather[0].main}\n`;
   textw += `*Description:-* ${data.weather[0].description}\n`;
   textw += `*Avg Temp:-* ${data.main.temp}\n`;
   textw += `*Feels Like:-* ${data.main.feels_like}\n`;
   textw += `*Pressure:-* ${data.main.pressure}\n`;
   textw += `*Humidity:-* ${data.main.humidity}\n`;
   textw += `*Humidity:-* ${data.wind.speed}\n`;
   textw += `*Latitude:-* ${data.coord.lat}\n`;
   textw += `*Longitude:-* ${data.coord.lon}\n`;
   textw += `*Country:-* ${data.sys.country}\n\n`;
   textw += Config.caption;
   message.bot.sendUi(message.jid, { caption: textw }, { quoted: message }, "text", "true");
  } catch (e) {
   return await message.error(`${e}\n\n command: weather`, e, `*_Please provide valid city name!_*`);
  }
 }
);
//---------------------------------------------------------------------------
smd(
 {
  pattern: "npm",
  desc: "download mp4 from url.",
  category: "search",
  use: "<package name>",
  
 },
 async (message, match) => {
  try {
   if (!match) return message.reply("Please give me package name.📦");
   const { data } = await axios.get(`https://api.npms.io/v2/search?q=${match}`);
   let txt = data.results
    .map(({ package: pkg }) => `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`)
    .join("\n\n")
    ?.trim();
   data && txt ? await message.reply(txt) : await message.reply("*No Result Found. Sorry!!*");
  } catch (e) {
   await message.error(`${e}\n\ncommand : npm`, e);
  }
 }
);

smd(
 {
  pattern: "cric",
  category: "search",
  desc: "Sends info of given query from Google Search.",
  use: "<text>",
  
 },
 async (message, text) => {
  try {
   await message.reply(`*_Please Wait, Getting Cricket Info_*`);
   const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=f68d1cb5-a9c9-47c5-8fcd-fbfe52bace78");
   const dat = await response.json();

   for (let i = 0; i < dat.data.length; i++) {
    let j = i + 1;
    text += `\n*--------------------- MATCH ${i}-------------------*`;
    text += "\n*Match Name:* " + dat.data[i].name;
    text += "\n*Match Status:* " + dat.data[i].status;
    text += "\n*Match Date:* " + dat.data[i].dateTimeGMT;
    text += "\n*Match Started:* " + dat.data[i].matchStarted;
    text += "\n*Match Ended:* " + dat.data[i].matchEnded;
   }
   return await message.reply(text);
  } catch (e) {
   return await message.error(`${e}\n\n command: cric`, e, `*_Uhh dear, Didn't get any results!_*`);
  }
 }
);

//---------------------------------------------------------------------------
smd(
 {
  pattern: "google",
  alias: ["search", "gsearch"],
  category: "search",
  desc: "Sends info of given query from Google Search.",
  use: "<text>",
  
 },
 async (message, text) => {
  try {
   if (!text) return message.reply(`*_Uhh please, give me a query_*\n*_Example : ${prefix}google Asta Md._*`);
   let google = require("google-it");
   google({ query: text }).then((res) => {
    let msg = `Google Search From : ${text} \n\n`;
    for (let g of res) {
     msg += `➣ *Title : ${g.title}*\n`;
     msg += `➣ *Description :* ${g.snippet}\n`;
     msg += `➣ *Link :* _${g.link}_\n\n────────────────────────\n\n`;
    }

    return message.reply(msg);
   });
  } catch (e) {
   return await message.error(`${e}\n\n command: google`, e, `*_Uhh dear, Didn't get any results!_*`);
  }
 }
);

const downloadImages = async (query = "", safe = "on") => {
 if (!query) throw "need search query";

 // Function to fetch images from the gimg API
 const gimg_api = async (query) => {
  try {
   let { data } = await axios.get(`${api_smd}/api/gimg?query=${encodeURIComponent(query)}`);
   if (data && data.status && Array.isArray(data.result) && data.result.length > 0) {
    return data.result;
   }
   return false;
  } catch (error) {
   console.error("Error fetching images from gimg smd-api-1.vercel.app:", error);
   return false;
  }
 };

 // Function to fetch images from the bingimg API
 const bing_api = async (query) => {
  try {
   let { data } = await axios.get(`${api_smd}/api/bingimg?query=${encodeURIComponent(query)}`);
   if (data && data.status && Array.isArray(data.result) && data.result.length > 0) {
    return data.result;
   }
   return false;
  } catch (error) {
   console.error("Error fetching images from bingimg (smd-api-1.vercel.app) API:", error);
   return false;
  }
 };

 // Function to fetch images using the g-i-s package (Google Images)
 const pkg_api = async (query) => {
  try {
   let data = await gis(query, {
    query: { safe },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
   });
   if (data && Array.isArray(data) && data.length > 0) {
    return data;
   }
   return false;
  } catch (error) {
   console.error("Error fetching images from Google Images:", error);
   return false;
  }
 };

 // Array of functions to fetch images from different APIs
 let func_Img = [pkg_api, gimg_api, bing_api];

 // Iterate over the functions and try fetching images
 let res = false;
 for (let i = 0; i < func_Img.length; i++) {
  try {
   res = await func_Img[i](query);
   if (res && res.length > 0) break; // If images are found, break the loop
  } catch (e) {
   console.error("Error fetching images:", e);
  }
 }

 return res;
};

smd(
 {
  pattern: "image",
  alias: ["img", "pic"],
  category: "search",
  desc: "Searches Image on Google",
  use: "<text>",
  
 },
 async (message, match) => {
  try {
   let text = match ? match : message.reply_text;
   if (!text) return message.reply(`Provide me a query!\n*Ex : .image luffy |10*`);

   let name1 = text.split("|")[0] || text;
   let name2 = text.split("|")[1] || 5;

   let nn = parseInt(name2) || 5;

   try {
    let n = await downloadImages(name1, "off");
    if (n && n[0]) {
     nn = n && n.length > nn ? nn : n.length;
     await message.reply(`*_Sending images of '${name1}' in chat!_*`);
     for (let i = 0; i < nn; i++) {
      try {
       let random = Math.floor(Math.random() * n.length);
       message.bot.sendFromUrl(message.jid, n[random].url || n[random], "", message, {}, "image");
       n.splice(random, 1);
      } catch {}
     }
     return;
    }
   } catch (e) {
    console.log("ERROR IN SYNC G>I>S IMAGE PACKAGE\n\t", e);
   }

   let buttonMessage = {};

   let urlsArray = [];
   const params = {
    q: name1,
    tbm: "isch",
    hl: "en",
    gl: "in",
    ijn: "0",
   };
   const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
    "Accept-Encoding": "application/json",
   };

   const res = await axios.get("https://www.google.com/search", { headers: headers, params: params });
   let body = res.data;
   body = body.slice(body.lastIndexOf("AF_initDataCallback"));
   body = body.slice(body.indexOf("["));
   body = body.slice(0, body.indexOf("</script>") - 1);
   body = body.slice(0, body.lastIndexOf(","));

   const img = JSON.parse(body);

   const imgObjects = img[56][1][0][0][1][0];

   for (let i = 0; i < name2; i++) {
    if (imgObjects[i] && imgObjects[i][0][0]["444383007"][1]) {
     let url = imgObjects[i][0][0]["444383007"][1][3][0]; // the url
     urlsArray.push(url);
    }
   }

   for (let url of urlsArray) {
    try {
     message.bot.sendFromUrl(message.chat, url, "", message, {}, "image");
    } catch {}
   }
  } catch (e) {
   return await message.error(`${e}\n\n command: image`, e, `*_Uhh dear, Didn't get any results!_*`);
  }
 }
);
//---------------------------------------------------------------------------
smd(
 {
  pattern: "couplepp",
  category: "search",
  desc: "Sends two couples pics.",
  
 },
 async (message) => {
  try {
   let anu = await fetchJson("https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json");
   let random = anu[Math.floor(Math.random() * anu.length)];
   message.reply(random.male, { caption: `*✦Couple Male profile✦*` }, "image");
   message.reply(random.female, { caption: `*✦Couple Female profile✦*` }, "image");
  } catch (e) {
   return await message.error(`${e}\n\n command: couplepp`, e, `*_Uhh dear, Didn't get any results!_*`);
  }
 }
);
//---------------------------------------------------------------------------
smd(
 {
  pattern: "iswa",
  category: "search",
  desc: "Searches in given rage about given number.",
 },
 async (message, text) => {
  if (!text) return await message.reply("Give Me Number without + sign. Example: .iswa 234902786xx");
  var inputnumber = text.split(" ")[0];
  if (!inputnumber.includes("x")) return message.reply(`*You did not add x*\nExample: iswa 234902786xx  \n ${Config.caption}`);
  message.reply(`*Searching for WhatsApp account in given range...* \n ${Config.caption}`);

  function countInstances(string, word) {
   return string.split(word).length - 1;
  }
  var number0 = inputnumber.split("x")[0];
  var number1 = inputnumber.split("x")[countInstances(inputnumber, "x")] ? inputnumber.split("x")[countInstances(inputnumber, "x")] : "";
  var random_length = countInstances(inputnumber, "x");
  var randomxx;
  if (random_length == 1) {
   randomxx = 10;
  } else if (random_length == 2) {
   randomxx = 100;
  } else if (random_length == 3) {
   randomxx = 1000;
  }

  text = `*--『 List of Whatsapp Numbers 』--*\n\n`;
  var nobio = `\n*Bio:* || \nHey there! I am using WhatsApp.\n`;
  var nowhatsapp = `\n*Numbers with no WhatsApp account within provided range.*\n`;
  for (let i = 0; i < randomxx; i++) {
   var nu = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
   var status1 = nu[Math.floor(Math.random() * nu.length)];
   var status2 = nu[Math.floor(Math.random() * nu.length)];
   var status3 = nu[Math.floor(Math.random() * nu.length)];
   var dom4 = nu[Math.floor(Math.random() * nu.length)];
   var random;
   if (random_length == 1) {
    random = `${status1}`;
   } else if (random_length == 2) {
    random = `${status1}${status2}`;
   } else if (random_length == 3) {
    random = `${status1}${status2}${status3}`;
   } else if (random_length == 4) {
    random = `${status1}${status2}${status3}${dom4}`;
   }

   var anu = await message.bot.onWhatsApp(`${number0}${i}${number1}@s.whatsapp.net`);
   var anuu = anu.length !== 0 ? anu : false;
   try {
    try {
     var anu1 = await message.bot.fetchStatus(anu[0].jid);
    } catch {
     var anu1 = "401";
    }
    if (anu1 == "401" || anu1.status.length == 0) {
     nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`;
    } else {
     text += `🧐 *Number:* wa.me/${anu[0].jid.split("@")[0]}\n ✨*Bio :* ${anu1.status}\n🍁*Last update :* ${moment(anu1.setAt).tz(timezone).format("HH:mm:ss DD/MM/YYYY")}\n\n`;
    }
   } catch {
    nowhatsapp += ` ≛ ${number0}${i}${number1}\n`;
   }
  }
  return await message.reply(`${text}${nobio}${nowhatsapp}`);
 }
);

smd(
 {
  pattern: "nowa",
  category: "search",
  desc: "Searches in given rage about given number.",
  use: "9112345678xx",
  
 },
 async (message, text) => {
  if (!text) return await message.reply("Give Me Number without + sign. Example: .nowa 234902786xx");
  const inputNumber = text.split(" ")[0];
  if (!inputNumber.includes("x")) return message.reply(`*You did not add x in number.*\nExample: ${prefix}nowa 234902786xx  \n ${Config.caption}`);
  message.reply(`*Searching for WhatsApp account in the given range...*\n${Config.caption}`);
  function countInstances(string, word) {
   return string.split(word).length - 1;
  }
  const number0 = inputNumber.split("x")[0];
  const number1 = inputNumber.split("x").slice(-1)[0] || "";
  const randomLength = countInstances(inputNumber, "x");
  const randomxx = [10, 100, 1000][randomLength - 1] || 0;
  let nobio = `\n*『 WhatsApp Account With No Bio』* \n`;
  let nobios = "";
  let nowhatsapp = `*『 Numbers With No WhatsApp Account 』* \n\n`;
  for (let i = 0; i < randomxx; i++) {
   const nu = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
   const status = nu
    .slice(0, randomLength)
    .map(() => nu[Math.floor(Math.random() * nu.length)])
    .join("");
   const random = `${status}${nu[Math.floor(Math.random() * nu.length)]}`.slice(0, randomLength);
   const anu = await message.bot.onWhatsApp(`${number0}${i}${number1}`);
   const anuu = anu.length !== 0 ? anu : false;
   try {
    const anu1 = await message.bot.fetchStatus(anu[0].jid);
    if (anu1 === "401" || anu1.status.length === 0) {
     nobios += `wa.me/${anu[0].jid.split("@")[0]}\n`;
    }
   } catch {
    nowhatsapp += ` ≛ ${number0}${i}${number1}\n`;
   }
  }
  if (!nobios) {
   nobio = "";
  } else {
   nobio += nobios + "\n\n";
  }
  return await message.reply(`${nobio}${nowhatsapp}${Config.caption}`);
 }
);
