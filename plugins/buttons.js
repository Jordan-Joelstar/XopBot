const os = require("os");
const fs = require("fs");
const Config = require("../config");
let { fancytext, runtime, formatp, prefix, bot } = require("../lib");
const long = String.fromCharCode(8206);
const readmore = long.repeat(4001);
const cron = require("node-cron");
global.button = global.BUTTONS || '1'
global.caption = global.caption || Config.caption || "αѕтα-м∂ 2024";
global.ownername = global.ownername || Config.ownername || "αѕтяσ";
global.botname = global.botname || Config.botname || "αѕтα-м∂";
global.menu = global.menu || Config.menu || "";
global.HANDLERS = global.HANDLERS || Config.HANDLERS || prefix || "^";
global.menu_fancy = global.menu_fancy || process.env.MENU_FANCY || "ss";
global.ui_Cache = {};
global.ui_urls = [];
var cronStart = false;
if (!cronStart) {
  cron.schedule("*/15 * * * *", () => {
    cronStart = true;
    fs.readdir("./temp", (err, files) => {
      if (err) {
        return;
      } else {
        files.forEach((file) => {
          try {
            fs.unlinkSync("./temp/" + file);
          } catch {
            console.log("ERROR DELETING FILES: ", e);
          }
        });
      }
    });
  });
}
global.create_UI = () => {
  if (!global.userImages || /text|txt|nothing/.test(global.userImages)) {
    return {};
  }
  const initFormat = [".jpg", ".jpeg", ".png", ".webp"];
  const rcnFormat = [".mp4", ".avi", ".mov", ".mkv", ".gif", ".m4v"];
  if (!ui_urls || !ui_urls[0]) {
    ui_urls = global.userImages ? global.userImages.split(",") : [""];
    ui_urls = ui_urls.filter((_0x2e34e7) => _0x2e34e7.trim() !== "");
  }
  let RandomSwitch = (
    ui_urls[Math.floor(Math.random() * ui_urls.length)] || ""
  ).trim();
  if (/http/gi.test(RandomSwitch) && !ui_infoCache[RandomSwitch]) {
    const IndexedSwitched = RandomSwitch.substring(
      RandomSwitch.lastIndexOf(".")
    ).toLowerCase();
    if (initFormat.includes(IndexedSwitched)) {
      ui_Cache[RandomSwitch] = "image";
    } else if (rcnFormat.includes(IndexedSwitched)) {
      ui_Cache[RandomSwitch] = "video";
    }
  }
  return {
    [ui_Cache[RandomSwitch] || "Inavlid_Type_URL"]: {
      url: RandomSwitch,
    },
  };
};
global.createButtons = (OnMessage) => {
  if (!OnMessage || Array.isArray(OnMessage)) {
    return OnMessage || [];
  }
  const BtnValue =
    /#button\s*:\s*([^|]+)\s*\|\s*display_text\s*:\s*([^|]+)(?:\s*\|\s*(id)\s*:\s*([^|]+))?(?:\s*\|\s*(copy_code)\s*:\s*([^|]+))?\/#/gi;
  const JsonBtn = [];
  let BtnContext;
  while ((BtnContext = BtnValue.exec(OnMessage)) !== null) {
    try {
      const OnBtnValue = BtnContext[1].trim();
      const InBtnValue = BtnContext[2].trim();
      const OffBtnValue = BtnContext[4] ? BtnContext[4].trim() : "";
      let ActionBtn = BtnContext[6] ? BtnContext[6].trim() : "";
      let TouchValue = {
        display_text: InBtnValue,
      };
      if (OnBtnValue === "cta_copy") {
        TouchValue = {
          display_text: InBtnValue,
          id: OffBtnValue,
          copy_code: ActionBtn,
        };
      } else if (OnBtnValue === "cta_url") {
        TouchValue = {
          display_text: InBtnValue,
          url: ("" + (OffBtnValue || "")).replace(" /#", "").trim(),
          merchant_url: ActionBtn || "https://www.google.com",
        };
      } else {
        TouchValue = {
          display_text: InBtnValue,
          id: OffBtnValue,
        };
      }
      if (OnBtnValue) {
        JsonBtn.push({
          name: OnBtnValue,
          buttonParamsJson: JSON.stringify(TouchValue),
        });
      } else {
        log("button_name missing in", BtnContext[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return JsonBtn || [];
};
global.sendButtons = async (
  message,
  context = {},
  MessageBody = [],
  OnBodyBtn = false
) => {
  if (!message) {
    throw "need m instance";
  }
  let BtnJid = OnBodyBtn || message.jid;
  if (typeof context != "object") {
    context = {};
  }
  context.messageId = context.messageId || message.bot.messageId();
  if (typeof MessageBody === "string") {
    MessageBody = createButtons(MessageBody);
  }
  if (typeof context.buttons === "string" || Array.isArray(context.buttons)) {
    MessageBody = [...MessageBody, ...(createButtons(context.buttons) || [])];
  }
  let {
    generateWAMessageFromContent: MsgGen,
    proto: ProtCol,
    prepareWAMessageMedia: MediaMsg,
  } = require("@whiskeysockets/baileys");
  let OfDataMsg = {};
  try {
    if (typeof context.imageMessage === "object") {
      OfDataMsg = {
        imageMessage: context.imageMessage,
      };
    } else if (typeof context.videoMessage === "object") {
      OfDataMsg = {
        videoMessage: context.videoMessage,
      };
    } else {
      let OnDataMsg = false;
      let ImgVidValue = context.image || context.video ? context : create_UI();
      if (ImgVidValue.image) {
        OnDataMsg =
          (await MediaMsg(
            {
              image: ImgVidValue.image || log0,
            },
            {
              upload: message.bot.waUploadToServer,
            }
          )) || false;
      } else if (ImgVidValue.video) {
        OnDataMsg =
          (await MediaMsg(
            {
              image: ImgVidValue.video || log0,
            },
            {
              upload: message.bot.waUploadToServer,
            }
          )) || false;
      }
      if (OnDataMsg) {
        OfDataMsg = OnDataMsg.imageMessage
          ? {
              imageMessage: OnDataMsg.imageMessage,
            }
          : OnDataMsg.videoMessage
          ? {
              videoMessage: OnDataMsg.videoMessage,
            }
          : {};
      }
    }
  } catch (error) {
    OfDataMsg = {};
  }
  let FadedContext = {
    ...(await message.bot.contextInfo(
      botname,
      message.senderName || ownername
    )),
    ...(context.contextInfo || {}),
  };
  let _0x5f08d6 = MsgGen(
    BtnJid,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: ProtCol.Message.InteractiveMessage.create({
            body: {
              text: context.text || context.body || context.caption || "Astro",
            },
            footer: {
              text: context.footer || "αѕтα тє¢н тєαм",
            },
            header: {
              ...(OfDataMsg || {}),
              hasMediaAttachment:
                OfDataMsg.imageMessage || OfDataMsg.videoMessage ? true : false,
              ...(context.header || {}),
            },
            contextInfo: FadedContext,
            nativeFlowMessage:
              ProtCol.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: MessageBody,
              }),
          }),
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
        },
      },
    },
    context
  );
  await message.bot.relayMessage(BtnJid, _0x5f08d6.message, {
    messageId: context.messageId,
  });
  return _0x5f08d6;
};
bot(
  {
    cmdname: "menu",
    desc: "Help list",
    type: "user",
  },
  async (message, match) => {
    try {
      const { commands } = require("../lib");

      var MenuTopHeader;
      var MenuSideHeader;
      var MenuTopFooter;
      var CategoryStartHeader;
      var CategoryEndHeader;
      var CmdNameLine;
      var CategoryFullEnd;
      let MenuType = 0;
      if (menu === "") {
        MenuType = Math.floor(Math.random() * 4) + 1;
      }
      if (
        MenuType == 1 ||
        menu.trim().startsWith("1") ||
        menu.toLowerCase().includes("v1")
      ) {
        MenuTopHeader = "╭━━━〔 *" + botname + "* 〕━━━┈⊷";
        MenuSideHeader = "┃✵│";
        MenuTopFooter = "┃✵╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷";
        CategoryStartHeader = "╭─────────────┈⊷\n│「";
        CategoryEndHeader = "」\n╰┬────────────┈⊷";
        CmdNameLine = "││◦➛";
        CategoryFullEnd = "│╰────────────┈⊷\n╰─────────────┈⊷";
      } else if (
        MenuType == 2 ||
        menu.trim().startsWith("2") ||
        menu.toLowerCase().includes("v2")
      ) {
        MenuTopHeader = "╭═══ *" + botname + "*  ═══⊷\n┃❃╭──────────────";
        MenuSideHeader = "┃❃│";
        MenuTopFooter = "┃❃╰───────────────\n╰═════════════════⊷";
        CategoryStartHeader = "╭─❏";
        CategoryEndHeader = "❏";
        CmdNameLine = "┃❃│";
        CategoryFullEnd = "┃❃╰───────────────\n╰═════════════════⊷";
      } else {
        MenuTopHeader = "╭═══〘  " + botname + "  〙═══⊷❍\n┃✰╭──────────────";
        MenuSideHeader = "┃✰│";
        MenuTopFooter = "┃✰╰───────────────\n╰═════════════════⊷";
        CategoryStartHeader = "╭════〘";
        CategoryEndHeader = "〙════⊷❍";
        CmdNameLine = "┃✰│";
        CategoryFullEnd = "┃✰╰─────────────────❍\n╰══════════════════⊷❍";
      }
      const cmdlets = {};
      commands.map(async (query, data) => {
        if (query.dontAddCommandList === false && query.pattern !== undefined) {
          if (!cmdlets[query.category]) {
            cmdlets[query.category] = [];
          }
          cmdlets[query.category].push(query.pattern);
        }
      });
      let MenuFancys = [1, 22, 23, 1, 36, 35, 48, 1, 42, 55, 56];
      let text =
        parseInt(menu_fancy || "") ||
        MenuFancys[Math.floor(Math.random() * MenuFancys.length)];
      const currentTime = message.time;
      const currentDate = message.date;
      let BotInfoOnMenu =
        MenuTopHeader +
        "\n" +
        MenuSideHeader +
        " ＵＳＥＲ:- " +
        ownername +
        "\n" +
        MenuSideHeader +
        " ＭＯＤＥ:- " +
        Config.WORKTYPE +
        "\n" +
        MenuSideHeader +
        " ＣＭＤＳ:- " +
        commands.length +
        "\n" +
        MenuSideHeader +
        " ＡＬＩＶＥ:- " +
        runtime(process.uptime()) +
        "\n" +
        MenuSideHeader +
        " ＲＡＭ:- " +
        formatp(os.totalmem() - os.freemem()) +
        "\n" +
        MenuSideHeader +
        " ＴＩＭＥ:- " +
        currentTime +
        "\n" +
        MenuTopFooter +
        "\n\t```❑ ᴘᴀᴛᴄʜ 𝟹.𝟻.𝟶 ❑```\n " +
        readmore +
        "\n";
      for (const Texts in cmdlets) {
        BotInfoOnMenu +=
          CategoryStartHeader +
          " *" +
          fancytext(Texts, text) +
          "* " +
          CategoryEndHeader +
          "\n";
        if (match.toLowerCase() == Texts.toLowerCase()) {
          BotInfoOnMenu =
            CategoryStartHeader +
            " *" +
            fancytext(Texts, text) +
            "* " +
            CategoryEndHeader +
            "\n";
          for (const randomlate of cmdlets[Texts]) {
            BotInfoOnMenu +=
              CmdNameLine + " " + fancytext(randomlate, text) + "\n";
          }
          BotInfoOnMenu += CategoryFullEnd + "\n";
          break;
        } else {
          for (const _0x34d05f of cmdlets[Texts]) {
            BotInfoOnMenu +=
              CmdNameLine + " " + fancytext(_0x34d05f, text) + "\n";
          }
          BotInfoOnMenu += CategoryFullEnd + "\n";
        }
      }
      BotInfoOnMenu += caption;
      let Important = {
        caption: BotInfoOnMenu,
      };
      if (/1|buttons|btn/gi.test(BUTTONS) && message.device !== "web") {
        await sendButtons(message, {
          caption: BotInfoOnMenu,
          buttons:
            "\n            #button:cta_url | display_text : Get Your Own| id:" +
            github +
            " /# \n            #button:cta_url | display_text : Support| id:" +
            SupportGc +
            " /# \n            #button:cta_url | display_text : Channel | id:" +
            ChannelLink +
            " /#            \n            #button:cta_url | display_text : Full Support | id:" +
            tglink +
            " /#            \n            ",
        });
      } else {
        await message.sendUi(message.chat, Important, message);
      }
    } catch (error) {
      await message.error(error + "\nCommand:menu", error);
    }
  }
);
let tglink = "https://t.me/+tBdXzBsRBAMzNmFk";
let ChannelLink = "https://whatsapp.com/channel/0029VaPGt3QEwEjpBXT4Rv0z";
let SupportGc = "https://chat.whatsapp.com/Fb0ejJQeiPA08T0FB5H20g";
