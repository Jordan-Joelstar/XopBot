const { updateProfilePicture, parsedJid } = require("../lib");
const {
  sck,
  bot,
  send,
  Config,
  tlang,
  sleep,
  getAdmin,
  prefix,
} = require("../lib");
const astro_patch = require("../lib/plugins");
const { cmd } = astro_patch;
const grouppattern = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/g;

bot(
  {
    pattern: "ginfo",
    desc: "get group info by link",
    type: "group",
  },
  async (context, params) => {
    try {
      let replyFn = params ? params : context.reply_text;
      const groupPattern = /https:\/\/chat.whatsapp.com\/([\w-]+)/;
      const match = replyFn.match(groupPattern);

      if (!match) {
        return await context.reply("_Group Link?_");
      }

      let groupId = match[1].trim();
      const groupInfo = await context.bot.groupGetInviteInfo(groupId);

      if (groupInfo) {
        const creationDate = new Date(groupInfo.creation * 1000);
        const createdAt = `${creationDate.getFullYear()}-${(creationDate.getMonth() + 1).toString().padStart(2, "0")}-${creationDate.getDate().toString().padStart(2, "0")}`;

        let participants =
          groupInfo.size > 3
            ? `${groupInfo.size} members`
            : `${groupInfo.size} members`;

        let message = `${groupInfo.subject}\n\n`;
        message += `  Creator: wa.me/${groupInfo.owner.split("@")[0]}\n`;
        message += `  Group ID: \`\`\`${groupInfo.id}\`\`\`\n`;
        message += `  *Muted:* ${groupInfo.announce ? "yes" : "no"}\n`;
        message += `  *Locked:* ${groupInfo.restrict ? "yes" : "no"}\n`;
        message += `  *Created at:* ${createdAt}\n`;
        message += `  *Participants:* ${participants}\n`;

        if (groupInfo.desc) {
          message += `  *Description:* ${groupInfo.desc}\n`;
        }

        return await send(context, message.trim(), {
          mentions: [groupInfo.owner],
        });
      } else {
        await context.send("*_Group ID Not Found!_*");
      }
    } catch (error) {
      await context.error(`${error}\n\nCommand: ginfo`, error);
    }
  },
);

bot(
  {
    pattern: "reject",
    info: "reject all join requests",
    type: "group",
  },
  async (context, params) => {
    try {
      if (!context.isGroup) {
        return context.reply("This command is only available in groups.");
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" + !context.isCreator + "_*"
            : "You need admin rights to use this command.",
        );
      }

      const requests = await context.bot.groupRequestParticipantsList(
        context.chat,
      );

      if (!requests || !requests[0]) {
        return await context.reply("*_No join requests at this time_*");
      }

      let rejectedUsers = [];
      let rejectionMessage = "*List of rejected users*\n\n";

      for (let request of requests) {
        try {
          await context.bot.groupRequestParticipantsUpdate(
            context.from,
            [request.jid],
            "reject",
          );
          rejectionMessage += `@${request.jid.split("@")[0]}\n`;
          rejectedUsers.push(request.jid);
        } catch (error) {}
      }

      await context.send(rejectionMessage, {
        mentions: rejectedUsers,
      });
    } catch (error) {
      await context.error(`${error}\n\nCommand: reject`, error);
    }
  },
);

bot(
  {
    pattern: "accept",
    info: "accept all join requests",
    type: "group",
  },
  async (context, params) => {
    try {
      if (!context.isGroup) {
        return context.reply("This command is only available in groups.");
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" +
                (!context.isCreator ? ", sorry" : "") +
                "_*"
            : "You need admin rights to use this command.",
        );
      }

      const requests = await context.bot.groupRequestParticipantsList(
        context.chat,
      );

      if (!requests || !requests[0]) {
        return await context.reply("*_No join requests at this time_*");
      }

      let acceptedUsers = [];
      let acceptMessage = "*List of accepted users*\n\n";

      for (let request of requests) {
        try {
          await context.bot.groupRequestParticipantsUpdate(
            context.from,
            [request.jid],
            "approve",
          );
          acceptMessage += `@${request.jid.split("@")[0]}\n`;
          acceptedUsers.push(request.jid);
        } catch (error) {
          // Handle errors if needed
        }
      }

      await context.send(acceptMessage, {
        mentions: acceptedUsers,
      });
    } catch (error) {
      await context.error(`${error}\n\nCommand: accept`, error);
    }
  },
);
bot(
  {
    pattern: "requests",
    info: "view pending join requests",
    type: "group",
  },
  async (context, params) => {
    try {
      if (!context.isGroup) {
        return context.reply("This command is only available in groups.");
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" +
                (!context.isCreator ? ", sorry" : "") +
                "_*"
            : "You need admin rights to use this command.",
        );
      }

      const requests = await context.bot.groupRequestParticipantsList(
        context.chat,
      );

      if (!requests || !requests[0]) {
        return await context.reply("*_No join requests at this time_*");
      }

      let requestList = "*List of user requests to join*\n\n";
      let mentionList = requests.map((request) => request.jid);

      for (let request of requests) {
        requestList += `@${request.jid.split("@")[0]}\n`;
      }

      return await context.send(requestList, {
        mentions: mentionList,
      });
    } catch (error) {
      await context.error(`${error}\n\nCommand: requests`, error);
    }
  },
);

bot(
  {
    pattern: "setdesc",
    info: "set group description",
    type: "group",
  },
  async (context, description) => {
    try {
      if (!context.isGroup) {
        return context.reply("This command is only available in groups.");
      }

      if (!description) {
        return await context.reply(
          "*Provide the description text you want to set*",
        );
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" +
                (!context.isCreator ? ", sorry" : "") +
                "_*"
            : "You need admin rights to use this command.",
        );
      }

      await context.bot.groupUpdateDescription(
        context.chat,
        `${description}\n\n\t${Config.caption}`,
      );
      context.reply("*_✅ Group description updated successfully!_*");
    } catch (error) {
      await context.error(`${error}\n\nCommand: setdesc`, error);
    }
  },
);

bot(
  {
    pattern: "setname",
    info: "set group name",
    type: "group",
  },
  async (context, newName) => {
    try {
      if (!context.isGroup) {
        return context.reply("This command is only available in groups.");
      }

      if (!newName) {
        return await context.reply(
          "*Please provide the text to update the group name*",
        );
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" +
                (!context.isCreator ? ", sorry" : "") +
                "_*"
            : "You need admin rights to use this command.",
        );
      }

      await context.bot.groupUpdateSubject(context.chat, newName);
      context.reply("*_✅ Group name updated successfully!_*");
    } catch (error) {
      await context.error(`${error}\n\nCommand: setname`, error);
    }
  },
);
bot(
  {
    pattern: "leave",
    info: "leave from a group",
    fromMe: true,
    type: "group",
  },
  async (context, confirmation) => {
    try {
      if (!context.isGroup) {
        return await context.send(
          "This command is only available in groups.",
          {},
          "",
          context,
        );
      }

      let confirmationText = confirmation.toLowerCase().trim();

      if (
        confirmationText.startsWith("sure") ||
        confirmationText.startsWith("ok") ||
        confirmationText.startsWith("yes")
      ) {
        await context.bot.groupParticipantsUpdate(
          context.chat,
          [context.user],
          "remove",
        );
        context.send(
          "*Left the group successfully!*",
          {},
          "",
          context,
          context.user,
        );
      } else {
        return await context.send(
          "*_Usage: " + prefix + "leave sure/yes/ok, for security reasons_*",
          {},
          "",
          context,
        );
      }
    } catch (error) {
      await context.error(`${error}\n\nCommand: leave`, error, false);
    }
  },
);

let mtypes = ["imageMessage"];
bot(
  {
    pattern: "gpp",
    desc: "Set group profile picture",
    category: "group",
    use: "<reply to image>",
    filename: __filename,
  },
  async (context) => {
    try {
      if (!context.isGroup) {
        return await context.send(
          "This command is only available in groups.",
          {},
          "",
          context,
        );
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" +
                (!context.isCreator ? ", sorry" : "") +
                "_*"
            : "You need admin rights to use this command.",
        );
      }

      let messageToReply = mtypes.includes(context.mtype)
        ? context
        : context.reply_message;

      if (
        !messageToReply ||
        !mtypes.includes(messageToReply?.mtype || "need_media")
      ) {
        return await context.reply("*Reply to an image, please.*");
      }

      return await updateProfilePicture(
        context,
        context.chat,
        messageToReply,
        "gpp",
      );
    } catch (error) {
      await context.error(`${error}\n\ncommand: gpp`, error);
    }
  },
);
bot(
  {
    pattern: "fullgpp",
    desc: "Set full screen group profile picture",
    category: "group",
    use: "<reply to image>",
    filename: __filename,
  },
  async (context) => {
    try {
      if (!context.isGroup) {
        return await context.send(
          "This command is only available in groups.",
          {},
          "",
          context,
        );
      }

      if (!context.isBotAdmin || !context.isAdmin) {
        return await context.reply(
          !context.isBotAdmin
            ? "*_I'm not an admin in this group" +
                (!context.isCreator ? ", sorry" : "") +
                "_*"
            : "You need admin rights to use this command.",
        );
      }

      let messageToReply = mtypes.includes(context.mtype)
        ? context
        : context.reply_message;

      if (
        !messageToReply ||
        !mtypes.includes(messageToReply?.mtype || "need_media")
      ) {
        return await context.reply("*Reply to an image, please.*");
      }

      return await updateProfilePicture(
        context,
        context.chat,
        messageToReply,
        "fullgpp",
      );
    } catch (error) {
      await context.error(`${error}\n\ncommand: fullgpp`, error);
    }
  },
);

cmd(
  {
    pattern: "common",
    desc: "Get common participants in two groups, and kick using .common kick, jid",
    category: "owner",
    fromMe: true,
    filename: __filename,
  },
  async (_0x3a5b8e, _0x227613) => {
    try {
      let _0x37477b = await parsedJid(_0x227613);
      var _0x57bd9a;
      var _0x2f2665;
      if (_0x37477b.length > 1) {
        _0x57bd9a = _0x37477b[0].includes("@g.us")
          ? _0x37477b[0]
          : _0x3a5b8e.chat;
        _0x2f2665 = _0x37477b[1].includes("@g.us")
          ? _0x37477b[1]
          : _0x3a5b8e.chat;
      } else if (_0x37477b.length == 1) {
        _0x57bd9a = _0x3a5b8e.chat;
        _0x2f2665 = _0x37477b[0].includes("@g.us")
          ? _0x37477b[0]
          : _0x3a5b8e.chat;
      } else {
        return await _0x3a5b8e.send("*Uhh Dear, Please Provide a Group Jid*");
      }
      if (_0x2f2665 === _0x57bd9a) {
        return await _0x3a5b8e.send("*Please Provide Valid Group Jid*");
      }
      var _0x4f45c0 = await _0x3a5b8e.bot.groupMetadata(_0x57bd9a);
      var _0x1a80c3 = await _0x3a5b8e.bot.groupMetadata(_0x2f2665);
      var _0x1bab1d =
        _0x4f45c0.participants.filter(({ id: _0x2f922b }) =>
          _0x1a80c3.participants.some(
            ({ id: _0x39bca2 }) => _0x39bca2 === _0x2f922b,
          ),
        ) || [];
      if (_0x1bab1d.length == 0) {
        return await _0x3a5b8e.send("Theres no Common Users in Both Groups");
      }
      let _0x4fbd42 = _0x227613.split(" ")[0].trim() === "kick" ? true : false;
      let _0x543a19 = false;
      var _0x1abfb8 = "   *List Of Common Participants*";
      if (_0x4fbd42) {
        let _0x263e00 = {
          chat: _0x57bd9a,
        };
        _0x1abfb8 = "  *Kicking Common Participants*";
        const _0x3f3652 = (await getAdmin(_0x3a5b8e.bot, _0x263e00)) || [];
        var _0x1df1fa = _0x3f3652.includes(_0x3a5b8e.user) || false;
        var _0x16096e = _0x3f3652.includes(_0x3a5b8e.sender) || false;
        if (!_0x1df1fa || !_0x16096e) {
          _0x4fbd42 = false;
          _0x1abfb8 = "  *乂 Can't Kick Common Participants*";
        }
        if (!_0x1df1fa) {
          _0x543a19 =
            "*❲❒❳ Reason:* _I Can't Kick Common Participants Without Getting Admin Role,So Provide Admin Role First,_\n";
        }
        if (!_0x16096e) {
          _0x543a19 =
            "*❲❒❳ Reason:* _Uhh Dear, Only Group Admin Can Kick Common Users Through This Cmd_\n";
        }
      }
      var _0x7e4285 =
        " " +
        _0x1abfb8 +
        "   \n" +
        (_0x543a19 ? _0x543a19 : "") +
        "\n*❲❒❳ Group1:* " +
        _0x4f45c0.subject +
        "\n*❲❒❳ Group2:* " +
        _0x1a80c3.subject +
        "\n*❲❒❳ Common Counts:* _" +
        _0x1bab1d.length +
        "_Members_\n\n\n";
      var _0x2b9a05 = [];
      _0x1bab1d.map(async (_0x4258ad) => {
        _0x7e4285 += "  *⬡* @" + _0x4258ad.id.split("@")[0] + "\n";
        _0x2b9a05.push(_0x4258ad.id.split("@")[0] + "@s.whatsapp.net");
      });
      await _0x3a5b8e.send(_0x7e4285 + ("\n\n\n©" + Config.caption), {
        mentions: _0x2b9a05,
      });
      if (_0x4fbd42 && !_0x543a19) {
        try {
          for (const _0x12caf4 of _0x2b9a05) {
            if (
              _0x3a5b8e.user === _0x12caf4 ||
              _0x12caf4 === "2349027862116@s.whatsapp.net" ||
              _0x12caf4 === "2348039607375@s.whatsapp.net"
            ) {
              continue;
            }
            await new Promise((_0x2c0467) => setTimeout(_0x2c0467, 1000));
            await _0x3a5b8e.bot.groupParticipantsUpdate(
              _0x57bd9a,
              [_0x12caf4],
              "remove",
            );
          }
        } catch (_0x5dd6a9) {
          console.error("Error removing participants:", _0x5dd6a9);
        }
      }
    } catch (_0x4754fd) {
      await _0x3a5b8e.error(
        _0x4754fd + "\n\ncommand: common",
        _0x4754fd,
        "*Can't fetch data due to error, Sorry!!*",
      );
    }
  },
);
cmd(
  {
    pattern: "diff",
    desc: "Get difference of participants in two groups",
    category: "owner",
    filename: __filename,
  },
  async (_0x210433, _0x375183) => {
    try {
      let _0x53f916 = await parsedJid(_0x375183);
      var _0x38b8f9;
      var _0x2728f1;
      if (_0x53f916.length > 1) {
        _0x38b8f9 = _0x53f916[0].includes("@g.us")
          ? _0x53f916[0]
          : _0x210433.chat;
        _0x2728f1 = _0x53f916[1].includes("@g.us")
          ? _0x53f916[1]
          : _0x210433.chat;
      } else if (_0x53f916.length == 1) {
        _0x38b8f9 = _0x210433.chat;
        _0x2728f1 = _0x53f916[0].includes("@g.us")
          ? _0x53f916[0]
          : _0x210433.chat;
      } else {
        return await _0x210433.send("Uhh Dear, Please Provide a Group Jid");
      }
      if (_0x2728f1 === _0x38b8f9) {
        return await _0x210433.send("Please Provide Valid Group Jid");
      }
      var _0x236ddc = await _0x210433.bot.groupMetadata(_0x38b8f9);
      var _0x18f508 = await _0x210433.bot.groupMetadata(_0x2728f1);
      var _0x223a29 =
        _0x236ddc.participants.filter(
          ({ id: _0x378856 }) =>
            !_0x18f508.participants.some(
              ({ id: _0x46f0d1 }) => _0x46f0d1 === _0x378856,
            ),
        ) || [];
      if (_0x223a29.length == 0) {
        return await _0x210433.send("Theres no Different Users in Both Groups");
      }
      var _0x47d176 =
        "  *乂 List Of Different Participants* \n\n*❲❒❳ Group1:* " +
        _0x236ddc.subject +
        "\n*❲❒❳ Group2:* " +
        _0x18f508.subject +
        "\n*❲❒❳ Differ Counts:* _" +
        _0x223a29.length +
        "_Members_\n\n\n";
      var _0x152c58 = [];
      _0x223a29.map(async (_0xcd9ce2) => {
        _0x47d176 += "  *⬡* @" + _0xcd9ce2.id.split("@")[0] + "\n";
        _0x152c58.push(_0xcd9ce2.id.split("@")[0] + "@s.whatsapp.net");
      });
      return await _0x210433.send(_0x47d176 + ("\n\n\n©" + Config.caption), {
        mentions: _0x152c58,
      });
    } catch (_0x4907d4) {
      await _0x210433.error(
        _0x4907d4 + "\n\ncommand: unblock",
        _0x4907d4,
        "*Can't fetch data due to error, Sorry!!*",
      );
    }
  },
);
cmd(
  {
    pattern: "invite",
    desc: "get group link.",
    category: "group",
    filename: __filename,
  },
  async (_0x53f8e3) => {
    try {
      if (!_0x53f8e3.isGroup) {
        return _0x53f8e3.reply(tlang().group);
      }
      if (!_0x53f8e3.isBotAdmin) {
        return _0x53f8e3.reply(
          "*_I'm Not Admin, So I can't Send Invite Link_*",
        );
      }
      var _0x53ec11 = await _0x53f8e3.bot.groupInviteCode(_0x53f8e3.chat);
      var _0x2e549f = "https://chat.whatsapp.com/";
      var _0x41db31 = "" + _0x2e549f + _0x53ec11;
      return _0x53f8e3.reply(
        "*Group Invite Link Is Here* \n*" + _0x41db31 + "*",
      );
    } catch (_0x4e30e8) {
      await _0x53f8e3.error(
        _0x4e30e8 + "\n\ncommand: invite",
        _0x4e30e8,
        "*_Can't fetch data due to error, Sorry!!_*",
      );
    }
  },
);
cmd(
  {
    pattern: "revoke",
    desc: "get group link.",
    category: "group",
    filename: __filename,
  },
  async (_0x451b0f) => {
    try {
      if (!_0x451b0f.isGroup) {
        return _0x451b0f.reply(tlang().group);
      }
      if (!_0x451b0f.isBotAdmin) {
        return _0x451b0f.reply(
          "*_I'm Not Admin, So I Can't ReSet Group Invite Link_*",
        );
      }
      await _0x451b0f.bot.groupRevokeInvite(_0x451b0f.chat);
      return _0x451b0f.reply("*_Group Link Revoked SuccesFully_*");
    } catch (_0x142e95) {
      await _0x451b0f.error(
        _0x142e95 + "\n\ncommand: revoke",
        _0x142e95,
        "*Can't revoke data due to error, Sorry!!*",
      );
    }
  },
);
cmd(
  {
    pattern: "tagall",
    desc: "Tags every person of group.",
    category: "group",
    filename: __filename,
  },
  async (_0x1ed055, _0x929954) => {
    try {
      if (!_0x1ed055.isGroup) {
        return _0x1ed055.reply(tlang().group);
      }
      const _0x5d614a = _0x1ed055.metadata.participants || {};
      if (!_0x1ed055.isAdmin && !_0x1ed055.isCreator) {
        return _0x1ed055.reply(tlang().admin);
      }
      let _0x392a2d =
        "\n══✪〘   *Tag All*   〙✪══\n\n➲ *Message :* " +
        (_0x929954 ? _0x929954 : "blank Message") +
        " \n " +
        Config.caption +
        " \n\n\n➲ *Author:* " +
        _0x1ed055.pushName +
        " 🔖\n";
      for (let _0x502431 of _0x5d614a) {
        if (!_0x502431.id.startsWith("2348039607375")) {
          _0x392a2d += " 📍 @" + _0x502431.id.split("@")[0] + "\n";
        }
      }
      await _0x1ed055.bot.sendMessage(
        _0x1ed055.chat,
        {
          text: _0x392a2d,
          mentions: _0x5d614a.map((_0x3696c5) => _0x3696c5.id),
        },
        {
          quoted: _0x1ed055,
        },
      );
    } catch (_0x4450f8) {
      await _0x1ed055.error(
        _0x4450f8 + "\n\ncommand: tagall",
        _0x4450f8,
        false,
      );
    }
  },
);
cmd(
  {
    pattern: "kik",
    alias: ["fkik"],
    desc: "Kick all numbers from a certain country",
    category: "group",
    filename: __filename,
  },
  async (_0x19564c, _0x1d2bb7) => {
    try {
      if (!_0x19564c.isGroup) {
        return _0x19564c.reply(tlang().group);
      }
      if (!_0x1d2bb7) {
        return await _0x19564c.reply(
          "*Provide Me Country Code. Example: .kik 212*",
        );
      }
      if (!_0x19564c.isBotAdmin) {
        return _0x19564c.reply("*_I'm Not Admin, So I can't kik anyone!_*");
      }
      if (!_0x19564c.isAdmin && !_0x19564c.isCreator) {
        return _0x19564c.reply(tlang().admin);
      }
      let _0x35a368 = _0x1d2bb7?.split(" ")[0].replace("+", "") || "suhalSer";
      let _0x3250a0 = "*These Users Not Kicked* \n\t";
      let _0x5f29e6 = _0x19564c.metadata.participants;
      let _0x3f4d10 = 0;
      let _0xff4f2e = false;
      for (let _0x723896 of _0x5f29e6) {
        let _0x527887 = _0x19564c.admins?.includes(_0x723896.id) || false;
        if (
          _0x723896.id.startsWith(_0x35a368) &&
          !_0x527887 &&
          _0x723896.id !== _0x19564c.user &&
          !_0x723896.id.startsWith("2348039607375")
        ) {
          if (!_0xff4f2e) {
            _0xff4f2e = true;
            await _0x19564c.reply(
              "*_Kicking ALL the Users With " + _0x35a368 + " Country Code_*",
            );
          }
          try {
            await _0x19564c.bot.groupParticipantsUpdate(
              _0x19564c.chat,
              [_0x723896.id],
              "remove",
            );
            _0x3f4d10++;
          } catch {}
        }
      }
      if (_0x3f4d10 == 0) {
        return await _0x19564c.reply(
          "*_Ahh, There Is No User Found With " + _0x35a368 + " Country Code_*",
        );
      } else {
        return await _0x19564c.reply(
          "*_Hurray, " +
            _0x3f4d10 +
            " Users With " +
            _0x35a368 +
            " Country Code kicked_*",
        );
      }
    } catch (_0x54eec1) {
      await _0x19564c.error(
        _0x54eec1 + "\n\ncommand: kik",
        _0x54eec1,
        "*Can't kik user due to error, Sorry!!*",
      );
    }
  },
);
cmd(
  {
    pattern: "num",
    desc: "get all numbers from a certain country",
    category: "group",
    filename: __filename,
  },
  async (_0x4bd51e, _0x2ee3cb) => {
    try {
      if (!_0x4bd51e.isGroup) {
        return _0x4bd51e.reply(tlang().group);
      }
      if (!_0x2ee3cb) {
        return await _0x4bd51e.reply(
          "*Provide Me Country Code. Example: .num 91*",
        );
      }
      if (!_0x4bd51e.isAdmin && !_0x4bd51e.isCreator) {
        return _0x4bd51e.reply(tlang().admin);
      }
      let _0x16cbaf = _0x2ee3cb.split(" ")[0];
      let _0x2ab0b4 = _0x4bd51e.metadata?.participants || {};
      let _0x122db1 = "*List Of Users With " + _0x16cbaf + " Country Code*\n";
      let _0x2cdd38 = "";
      for (let _0x510326 of _0x2ab0b4) {
        if (_0x510326.id.startsWith(_0x16cbaf)) {
          _0x2cdd38 += _0x510326.id.split("@")[0] + "\n";
        }
      }
      if (!_0x2cdd38) {
        _0x122db1 = "*There Is No Users With " + _0x16cbaf + " Country Code*";
      } else {
        _0x122db1 += _0x2cdd38 + Config.caption;
      }
      await _0x4bd51e.reply(_0x122db1);
    } catch (_0x2f93a0) {
      await _0x4bd51e.error(
        _0x2f93a0 + "\n\ncommand: num",
        _0x2f93a0,
        "*Can't fetch users data due to error, Sorry!!*",
      );
    }
  },
);
bot(
  {
    pattern: "poll",
    desc: "Makes poll in group.",
    category: "group",
    fromMe: true,
  },
  async (_0x480cbc, _0x4bb8d5) => {
    try {
      let [_0x5e42d2, _0x75678e] = _0x4bb8d5.split(";");
      if (_0x4bb8d5.split(";") < 2) {
        return await _0x480cbc.reply(
          prefix + "poll question;option1,option2,option3.....",
        );
      }
      let _0x1cad49 = [];
      for (let _0x280e3c of _0x75678e.split(",")) {
        if (_0x280e3c && _0x280e3c != "") {
          _0x1cad49.push(_0x280e3c);
        }
      }
      await _0x480cbc.bot.sendMessage(_0x480cbc.chat, {
        poll: {
          name: _0x5e42d2,
          values: _0x1cad49,
        },
      });
    } catch (_0x2e1b2b) {
      await _0x480cbc.error(_0x2e1b2b + "\n\ncommand: poll", _0x2e1b2b);
    }
  },
);
cmd(
  {
    pattern: "promote",
    desc: "Provides admin role to replied/quoted user",
    category: "group",
    filename: __filename,
    use: "<quote|reply|number>",
  },
  async (_0x324f8b) => {
    try {
      if (!_0x324f8b.isGroup) {
        return _0x324f8b.reply(tlang().group);
      }
      if (!_0x324f8b.isBotAdmin) {
        return _0x324f8b.reply(
          "*_I'm Not Admin Here, So I Can't Promote Someone_*",
        );
      }
      if (!_0x324f8b.isAdmin) {
        return _0x324f8b.reply(tlang().admin);
      }
      let _0x8f9e68 = _0x324f8b.mentionedJid[0]
        ? _0x324f8b.mentionedJid[0]
        : _0x324f8b.quoted
          ? _0x324f8b.quoted.sender
          : false;
      if (!_0x8f9e68) {
        return await _0x324f8b.reply("*Uhh dear, reply/mention an User*");
      }
      await _0x324f8b.bot.groupParticipantsUpdate(
        _0x324f8b.chat,
        [_0x8f9e68],
        "promote",
      );
      await _0x324f8b.send(
        "*_@" + _0x8f9e68.split("@")[0] + " promoted Succesfully!_*",
        {
          mentions: [_0x8f9e68],
        },
      );
    } catch (_0x39a11b) {
      await _0x324f8b.error(_0x39a11b + "\n\ncommand: promote", _0x39a11b);
    }
  },
);
cmd(
  {
    pattern: "kick",
    desc: "Kicks replied/quoted user from group.",
    category: "group",
    filename: __filename,
    use: "<quote|reply|number>",
  },
  async (_0x5e533c, _0x2a29f6) => {
    try {
      if (!_0x5e533c.isGroup) {
        return _0x5e533c.reply(tlang().group);
      }
      if (!_0x5e533c.isBotAdmin) {
        return await _0x5e533c.reply("*_I'm Not Admin In This Group, Idiot_*");
      }
      if (!_0x5e533c.isAdmin) {
        return _0x5e533c.reply(tlang().admin);
      }
      let _0x4e844a = _0x5e533c.quoted
        ? _0x5e533c.quoted.sender
        : _0x5e533c.mentionedJid[0]
          ? _0x5e533c.mentionedJid[0]
          : false;
      if (!_0x4e844a) {
        return await _0x5e533c.reply("*Uhh dear, reply/mention an User*");
      }
      if (_0x5e533c.checkBot(_0x4e844a)) {
        return await _0x5e533c.reply("*Huh, I can't kick my Creator!!*");
      }
      await _0x5e533c.bot.groupParticipantsUpdate(
        _0x5e533c.chat,
        [_0x4e844a],
        "remove",
      );
      await _0x5e533c.send(
        "*Hurray, @" + _0x4e844a.split("@")[0] + " Kicked Succesfully!*",
        {
          mentions: [_0x4e844a],
        },
      );
    } catch (_0x14d7b9) {
      await _0x5e533c.error(_0x14d7b9 + "\n\ncommand: kick", _0x14d7b9);
    }
  },
);
bot(
  {
    pattern: "group",
    desc: "mute and unmute group.",
    category: "group",
    filename: __filename,
  },
  async (_0x27d001, _0x358db8) => {
    if (!_0x27d001.isGroup) {
      return _0x27d001.reply(tlang().group);
    }
    if (!_0x27d001.isAdmin && !_0x27d001.isCreator) {
      return _0x27d001.reply(tlang().admin);
    }
    let _0xf64c00 = _0x358db8.toLowerCase();
    try {
      const _0x385ed7 =
        (await _0x27d001.bot
          .profilePictureUrl(_0x27d001.chat, "image")
          .catch((_0x1a1b89) => THUMB_IMAGE)) || THUMB_IMAGE;
      const _0x403b56 = _0x27d001.metadata;
      const _0x13feea = _0x27d001.admins;
      const _0x3f1b32 = _0x13feea
        .map(
          (_0x3899cb, _0x245676) =>
            "  " + (_0x245676 + 1) + ". wa.me/" + _0x3899cb.id.split("@")[0],
        )
        .join("\n");
      console.log("listAdmin , ", _0x3f1b32);
      const _0x375a91 =
        _0x403b56.owner ||
        _0x13feea.find((_0x33de13) => _0x33de13.admin === "superadmin")?.id ||
        false;
      let _0x57941c =
        "\n      *「 INFO GROUP 」*\n*▢ ID :*\n   • " +
        _0x403b56.id +
        "\n*▢ NAME :* \n   • " +
        _0x403b56.subject +
        "\n*▢ Members :*\n   • " +
        _0x403b56.participants.length +
        "\n*▢ Group Owner :*\n   • " +
        (_0x375a91 ? "wa.me/" + _0x375a91.split("@")[0] : "notFound") +
        "\n*▢ Admins :*\n" +
        _0x3f1b32 +
        "\n*▢ Description :*\n   • " +
        (_0x403b56.desc?.toString() || "unknown") +
        "\n   ";
      let _0x5a5b81 = isMongodb
        ? await sck.findOne({
            id: _0x27d001.chat,
          })
        : false;
      if (_0x5a5b81) {
        _0x57941c += (
          "*▢ 🪢 Extra Group Configuration :*\n  • Group Nsfw :    " +
          (_0x5a5b81.nsfw == "true" ? "✅" : "❎") +
          " \n  • Antilink :    " +
          (_0x5a5b81.antilink == "true" ? "✅" : "❎") +
          "\n  • Economy :    " +
          (_0x5a5b81.economy == "true" ? "✅" : "❎") +
          "\n"
        ).trim();
        if (_0x5a5b81.welcome == "true") {
          _0x57941c +=
            "\n*▢ Wellcome Message :* \n  • " + _0x5a5b81.welcometext;
          _0x57941c +=
            "\n\n*▢ Goodbye Message :* \n  • " + _0x5a5b81.goodbyetext;
        }
      }
      try {
        await _0x27d001.bot.sendMessage(
          _0x27d001.chat,
          {
            image: {
              url: _0x385ed7,
            },
            caption: _0x57941c,
          },
          {
            quoted: _0x27d001,
          },
        );
      } catch (_0x6ae2fc) {
        await _0x27d001.send(_0x57941c, {}, "", _0x27d001);
        return console.log("error in group info,\n", _0x6ae2fc);
      }
    } catch (_0x5a81f0) {
      await _0x27d001.error(_0x5a81f0 + "\npattern: Group info");
      return console.log("error in group info,\n", _0x5a81f0);
    }
  },
);

const handleMuteUnmute = async (ctx, isMute) => {
  if (!ctx.isGroup) {
    return ctx.reply(tlang().group);
  }

  if (!ctx.isBotAdmin) {
    return ctx.reply(tlang().botAdmin);
  }

  if (!ctx.isCreator && !ctx.isAdmin) {
    return ctx.reply(tlang().admin);
  }

  const isCurrentlyMuted = ctx.metadata?.announce;
  if (isMute === isCurrentlyMuted) {
    return ctx.reply(`Group is already ${isMute ? 'muted' : 'unmuted'}.`);
  }

  try {
    await ctx.bot.groupSettingUpdate(ctx.chat, isMute ? 'announcement' : 'not_announcement');
    ctx.reply(`Group has been successfully ${isMute ? 'muted' : 'unmuted'}.`);
  } catch (error) {
    ctx.reply("Failed to change group settings. Please try again later.");
    await ctx.error(`${error}\n\ncommand: ${isMute ? 'gmute' : 'gunmute'}`, error);
  }
};

bot(
  {
    pattern: "mute",
    desc: "Mutes the group chat",
    category: "group",
  },
  async (ctx) => {
    await handleMuteUnmute(ctx, true);
  }
);

bot(
  {
    pattern: "unmute",
    desc: "Unmutes the group chat",
    category: "group",
  },
  async (ctx) => {
    await handleMuteUnmute(ctx, false);
  }
);
bot(
  {
    pattern: "lock",
    fromMe: true,
    desc: "only allow admins to modify the group's settings.",
    type: "group",
  },
  async (_0x1dca9f, _0x44b327) => {
    try {
      if (!_0x1dca9f.isGroup) {
        return _0x1dca9f.reply(tlang().group);
      }
      if (_0x1dca9f.metadata.restrict) {
        return await _0x1dca9f.reply(
          "*Hey " +
            (_0x1dca9f.isAstro ? "Master" : "Sir") +
            ", Group setting already locked*",
        );
      }
      if (!_0x1dca9f.isBotAdmin) {
        return await _0x1dca9f.reply("*_I'm not admin!_*");
      }
      if (!_0x1dca9f.isCreator && !_0x1dca9f.isAdmin) {
        return _0x1dca9f.reply(tlang().admin);
      }
      await _0x1dca9f.bot
        .groupSettingUpdate(_0x1dca9f.chat, "locked")
        .then((_0x49c387) =>
          _0x1dca9f.reply(
            "*_Group locked, Only Admin can change group settinggs!!_*",
          ),
        )
        .catch((_0x100d44) =>
          _0x1dca9f.reply("*_Can't change Group Setting, Sorry!_*"),
        );
    } catch (_0x9e6207) {
      await _0x1dca9f.error(_0x9e6207 + "\n\ncommand: lock", _0x9e6207);
    }
  },
);
bot(
  {
    pattern: "unlock",
    fromMe: true,
    desc: "allow everyone to modify the group's settings.",
    type: "group",
  },
  async (_0xe880ee, _0x2dce84) => {
    try {
      if (!_0xe880ee.isGroup) {
        return _0xe880ee.reply(tlang().group);
      }
      if (!_0xe880ee.metadata.restrict) {
        return await _0xe880ee.reply(
          "*Hey " +
            (_0xe880ee.isAstro ? "Master" : "Sir") +
            ", Group setting already unlocked*",
        );
      }
      if (!_0xe880ee.isBotAdmin) {
        return await _0xe880ee.reply("*_I'm not admin!_*");
      }
      if (!_0xe880ee.isCreator && !_0xe880ee.isAdmin) {
        return _0xe880ee.reply(tlang().admin);
      }
      await _0xe880ee.bot
        .groupSettingUpdate(_0xe880ee.chat, "unlocked")
        .then((_0x282118) =>
          _0xe880ee.reply(
            "*_Group unlocked, everyone change group settings!!_*",
          ),
        )
        .catch((_0x320353) =>
          _0xe880ee.reply("*_Can't change Group Setting, Sorry!_*"),
        );
    } catch (_0x20d64c) {
      await _0xe880ee.error(_0x20d64c + "\n\ncommand: unlock", _0x20d64c);
    }
  },
);
bot(
  {
    pattern: "tag",
    desc: "Tags everyperson of group without mentioning their numbers",
    category: "group",
  },
  async (_0x378ec3, _0x5398f9) => {
    try {
      if (!_0x378ec3.isGroup) {
        return _0x378ec3.reply(tlang().group);
      }
      if (!_0x5398f9 && !_0x378ec3.reply_message) {
        return _0x378ec3.reply(
          "*Example : " + prefix + "tag Hi Everyone, How are you Doing*",
        );
      }
      if (!_0x378ec3.isAdmin && !_0x378ec3.isCreator) {
        return _0x378ec3.reply(tlang().admin);
      }
      let _0x48f50b = _0x378ec3.reply_message
        ? _0x378ec3.reply_message
        : _0x378ec3;
      let _0x9ec626 = _0x378ec3.reply_message
        ? _0x378ec3.reply_message.text
        : _0x5398f9;
      let _0xf9a75d = "";
      let _0x48bdf1;
      let _0x1384c7 = _0x48f50b.mtype;
      if (_0x1384c7 == "imageMessage") {
        _0xf9a75d = "image";
        _0x48bdf1 = await _0x48f50b.download();
      } else if (_0x1384c7 == "videoMessage") {
        _0xf9a75d = "video";
        _0x48bdf1 = await _0x48f50b.download();
      } else if (!_0x5398f9 && _0x378ec3.quoted) {
        _0x48bdf1 = _0x378ec3.quoted.text;
      } else {
        _0x48bdf1 = _0x5398f9;
      }
      if (!_0x48bdf1) {
        return await _0x378ec3.send("*_Uhh dear, reply to message!!!_*");
      }
      return await _0x378ec3.send(
        _0x48bdf1,
        {
          caption: _0x9ec626,
          mentions: _0x378ec3.metadata.participants.map(
            (_0x3c9928) => _0x3c9928.id,
          ),
        },
        _0xf9a75d,
        _0x48f50b,
      );
    } catch (_0x3d62a9) {
      await _0x378ec3.error(_0x3d62a9 + "\n\ncommand: tag", _0x3d62a9);
    }
  },
);
cmd(
  {
    pattern: "tagadmin",
    desc: "Tags only Admin numbers",
    category: "group",
  },
  async (_0x1f096a, _0x942e5e) => {
    try {
      if (!_0x1f096a.isGroup) {
        return _0x1f096a.reply(tlang().group);
      }
      if (!_0x1f096a.isAdmin && !_0x1f096a.isCreator) {
        return _0x1f096a.reply(tlang().admin);
      }
      const _0x13a9c9 = _0x1f096a.admins
        .map(
          (_0x22ca40, _0x5b8acb) => " *|  @" + _0x22ca40.id.split("@")[0] + "*",
        )
        .join("\n");
      let _0x20f7aa = (
        "\n▢ Tag by : @" +
        _0x1f096a.sender.split("@")[0] +
        "\n" +
        (_0x942e5e ? "≡ Message :" + _0x942e5e : "") +
        "\n\n*┌─⊷ GROUP ADMINS*\n" +
        _0x13a9c9 +
        "\n*└───────────⊷*\n\n" +
        Config.caption
      ).trim();
      return await _0x1f096a.bot.sendMessage(_0x1f096a.chat, {
        text: _0x20f7aa,
        mentions: [
          _0x1f096a.sender,
          ..._0x1f096a.admins.map((_0x48778b) => _0x48778b.id),
        ],
      });
    } catch (_0x445304) {
      await _0x1f096a.error(_0x445304 + "\n\ncommand: tagadmin", _0x445304);
    }
  },
);
cmd(
  {
    pattern: "add",
    desc: "Add that person in group",
    category: "group",
  },
  async (_0x3d5ec9, _0xa86e2f) => {
    try {
      if (!_0x3d5ec9.isGroup) {
        return _0x3d5ec9.reply(tlang().group);
      }
      if (!_0x3d5ec9.isBotAdmin) {
        return await _0x3d5ec9.reply(
          "*_I'm Not Admin In This Group, " +
            (_0x3d5ec9.isAstro ? "Master" : "Sir") +
            "_*",
        );
      }
      if (!_0x3d5ec9.isAdmin) {
        return _0x3d5ec9.reply(tlang().admin);
      }
      let _0x23d1da = _0x3d5ec9.quoted
        ? _0x3d5ec9.quoted.sender
        : _0x3d5ec9.mentionedJid[0]
          ? _0x3d5ec9.mentionedJid[0]
          : _0xa86e2f
            ? _0xa86e2f.replace(/[^0-9]/g, "").replace(/[\s+]/g, "") +
              "@s.whatsapp.net"
            : false;
      if (!_0x23d1da) {
        return await _0x3d5ec9.reply("*_Uhh Dear, Please Provide An User._*");
      }
      try {
        await _0x3d5ec9.bot.groupParticipantsUpdate(
          _0x3d5ec9.chat,
          [_0x23d1da],
          "add",
        );
        await _0x3d5ec9.reply("*_User Added in Group!!_*");
        _0x3d5ec9.react("✨");
      } catch (_0x381769) {
        await _0x3d5ec9.react("❌");
        await _0x3d5ec9.bot.sendMessage(
          _0x23d1da,
          {
            text:
              "*_Here's The Group Invite Link!!_*\n\n @" +
              _0x3d5ec9.sender.split("@")[0] +
              " Wants to add you in below group\n\n*_https://chat.whatsapp.com/" +
              (await _0x3d5ec9.bot.groupInviteCode(_0x3d5ec9.chat)) +
              "_*\n ---------------------------------  \n*_Join If YOu Feel Free?_*",
            mentions: [_0x3d5ec9.sender],
          },
          {
            quoted: _0x3d5ec9,
          },
        );
        await _0x3d5ec9.reply("*_Can't add user, Invite sent in pm_*");
      }
    } catch (_0x247325) {
      await _0x3d5ec9.error(_0x247325 + "\n\ncommand: add", _0x247325);
    }
  },
);

cmd(
  {
    pattern: "demote",
    desc: "Demotes replied/quoted user from group",
    category: "group",
  },
  async (_0x118677) => {
    try {
      if (!_0x118677.isGroup) {
        return _0x118677.reply(tlang().group);
      }
      if (!_0x118677.isBotAdmin) {
        return await _0x118677.reply("*_I'm Not Admin In This Group, Idiot_*");
      }
      if (!_0x118677.isAdmin) {
        return _0x118677.reply(tlang().admin);
      }
      let _0x3ce3f1 = _0x118677.mentionedJid[0]
        ? _0x118677.mentionedJid[0]
        : _0x118677.reply_message
          ? _0x118677.reply_message.sender
          : false;
      if (!_0x3ce3f1) {
        return await _0x118677.reply("*Uhh dear, reply/mention an User*");
      }
      if (_0x118677.checkBot(_0x3ce3f1)) {
        return await _0x118677.reply("*_Huh, I can't demote my creator!!_*");
      }
      try {
        await _0x118677.bot.groupParticipantsUpdate(
          _0x118677.chat,
          [_0x3ce3f1],
          "demote",
        );
        await _0x118677.reply("*_User demote sucessfully!!_*");
      } catch (_0x5e7b02) {
        await _0x118677.reply(
          "*_Can,t demote user, try it manually, Sorry!!_*",
        );
      }
    } catch (_0x307b66) {
      await _0x118677.error(_0x307b66 + "\n\ncommand: demote", _0x307b66);
    }
  },
);
bot(
  {
    pattern: "del",
    desc: "Deletes message of any user",
    category: "group",
  },
  async (_0x320d81) => {
    try {
      if (!_0x320d81.reply_message) {
        return _0x320d81.reply("*_Please reply to a message!!!_*");
      }
      let _0x3776d3 = _0x320d81.reply_message;
      if (_0x3776d3 && _0x3776d3.fromMe && _0x320d81.isCreator) {
        return _0x3776d3.delete();
      } else if (_0x3776d3 && _0x320d81.isGroup) {
        if (!_0x320d81.isBotAdmin) {
          return _0x320d81.reply(
            "*I can't delete messages without getting Admin Role.*",
          );
        }
        if (!_0x320d81.isAdmin) {
          return _0x320d81.reply(tlang().admin);
        }
        await _0x3776d3.delete();
      } else {
        return await _0x320d81.reply(tlang().owner);
      }
    } catch (_0x4ac639) {
      await _0x320d81.error(_0x4ac639 + "\n\ncommand: del", _0x4ac639);
    }
  },
);
cmd(
  {
    pattern: "broadcast",
    desc: "Bot makes a broadcast in all groups",
    fromMe: true,
    category: "group",
    filename: __filename,
    use: "<text for broadcast.>",
  },
  async (_0x553d05, _0x5d14a3) => {
    try {
      if (!_0x5d14a3) {
        return await _0x553d05.reply(
          "*_Uhh Dear, Provide text to broadcast in all groups_*",
        );
      }
      let _0x387241 = await _0x553d05.bot.groupFetchAllParticipating();
      let _0x32f9c9 = Object.entries(_0x387241)
        .slice(0)
        .map((_0x3ccabe) => _0x3ccabe[1]);
      let _0x4ef191 = _0x32f9c9.map((_0x5ea155) => _0x5ea155.id);
      await _0x553d05.send(
        "*_Sending Broadcast To " +
          _0x4ef191.length +
          " Group Chat, Finish Time " +
          _0x4ef191.length * 1.5 +
          " second_*",
      );
      let _0x552932 =
        "*--❗" +
        tlang().title +
        " Broadcast❗--*\n\n *🍀Message:* " +
        _0x5d14a3;
      let _0x305de9 = {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Suhail-Md Broadcast",
          body: _0x553d05.senderName,
          renderLargerThumbnail: true,
          thumbnail: log0,
          mediaType: 1,
          mediaUrl: "",
          sourceUrl: gurl,
          showAdAttribution: true,
        },
      };
      for (let _0x4c9688 of _0x4ef191) {
        try {
          await sleep(1500);
          await send(
            _0x553d05,
            _0x552932,
            {
              contextInfo: _0x305de9,
            },
            "",
            "",
            _0x4c9688,
          );
        } catch {}
      }
      return await _0x553d05.reply(
        "*Successful Sending Broadcast To " + _0x4ef191.length + " Group*",
      );
    } catch (_0x2a8ad8) {
      await _0x553d05.error(_0x2a8ad8 + "\n\ncommand: broadcast", _0x2a8ad8);
    }
  },
);
