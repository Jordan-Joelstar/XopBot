const { Index } = require("../lib");
const toAttp = require("../lib/Base/sticker");
const roundSticker = require("../lib/Base/sticker");
const mixEmoji = require("../lib/Base/sticker");
const quoteSticker = require("../lib/Base/sticker");
const generateMeme = require("../lib/Base/sticker");
const circleSticker = require("../lib/Base/sticker");
const cropSticker = require("../lib/Base/sticker");
const takeSticker = require("../lib/Base/sticker");
const toSticker = require("../lib/Base/sticker");

Index(
 {
  pattern: "sticker",
  info: "Creates a sticker from a replied image/video.",
  type: "sticker",
 },
 toSticker
);

Index(
 {
  pattern: "take",
  info: "Creates a sticker from a replied image/video.",
  type: "sticker",
 },
 takeSticker
);

Index(
 {
  pattern: "attp",
  info: "Creates a sticker from the given text.",
  type: "sticker",
 },
 toAttp
);

Index(
 {
  pattern: "crop",
  info: "Creates a cropped sticker from a replied image.",
  type: "sticker",
 },
 cropSticker
);

Index(
 {
  pattern: "circle",
  info: "Creates a circular sticker from an image.",
  type: "sticker",
 },
 circleSticker
);

Index(
 {
  pattern: "round",
  info: "Creates a rounded sticker from a replied image/video.",
  type: "sticker",
 },
 roundSticker
);

Index(
 {
  pattern: "tomeme",
  desc: "Adds text to a quoted image.",
  category: "sticker",
 },
 generateMeme
);

Index(
 {
  pattern: "emix",
  desc: "Mixes two emojis.",
  category: "sticker",
 },
 mixEmoji
);

Index(
 {
  pattern: "qsticker",
  desc: "Creates a sticker from a quoted text.",
  category: "sticker",
 },
 quoteSticker
);
