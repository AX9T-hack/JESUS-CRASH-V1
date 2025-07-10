const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "📇",
    alias: ["gc_tagall", "appel", "rele"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
    async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
        try {
            if (!isGroup) return reply("❌ This command can only be used in groups.");

            const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
            const senderJid = senderNumber + "@s.whatsapp.net";

            if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
                return reply("❌ Only group admins or the bot owner can use this command.");
            }

            // Fetch group metadata
            let groupInfo = await conn.groupMetadata(from).catch(() => null);
            if (!groupInfo) return reply("❌ Failed to fetch group information.");

            let groupName = groupInfo.subject || "Unknown Group";
            let totalMembers = participants ? participants.length : 0;
            if (totalMembers === 0) return reply("❌ No members found in this group.");

            let emojis = ['*├❒┃➢🪐*', '*├❒┃➢🍁*', '*├❒┃➢💥*', '*├❒┃➢🩸*', '*├❒┃➢❄️*', '*├❒┃➢🕸️*'];
            let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

            // Extract message
            let message = body.slice(body.indexOf(command) + command.length).trim();
            if (!message) message = "ʜᴇʟʟᴏ ᴇᴠᴇʀʏᴏɴᴇ";

            // Get admins list
            const adminList = participants
                .filter(p => p.admin !== null)
                .map(p => `@${p.id.split('@')[0]}`)
                .join(', ');

            const formattedAdmins = adminList || 'Unknown';

            // Start building message
            let teks = `*╭╼━━━━⧼ᴍᴇɴᴛɪᴏɴs⧽━━━━╾╮*
*│👥ɢʀᴏᴜᴘ: ${groupName}*
*│🎰ᴍᴇᴍʙᴇʀs: ${totalMembers}*
*│📝ᴍᴇssᴀɢᴇ: ${message}*
*│🛡️ᴀᴅᴍɪɴs: ${formattedAdmins}*
*╰╼━━━━━━━━━━━━━━━━╾╯*

*╭╼┉┉┉┉〔ᴛᴀɢᴀʟʟs〕┉┉┉┉╮*
`;

            for (let mem of participants) {
                if (!mem.id) continue;
                teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
            }

            teks += "*└╼┉┉┉✪ 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 ✪┉┉┉*";

            conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

        } catch (e) {
            console.error("TagAll Error:", e);
            reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
        }
    });
