const {
default: makeWASocket,
getAggregateVotesInPollMessage,
getDevice,
delay,
makeInMemoryStore,
makeCacheableSignalKeyStore,
downloadContentFromMessage,
generateForwardMessageContent,
generateWAMessageFromContent,
prepareWAMessageMedia,
proto,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const prefix = '.'

const ownerNumber = ['94727319036']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
console.log("Session downloaded ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
//===========connect mongodb===================
const connectDB = require('./lib/mongodb')
connectDB();
//==============================================
const {readEnv} = require('./lib/database')   
const config = await readEnv();
//==============================================
        
console.log("Connecting Queen Rashu Md bot 🧬...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('😼 Installing... ')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Plugins installed successful ✅')
console.log('Queen Rashu Md Bot connected to whatsapp ✅')

let up = `* *~𝐐𝐔𝚵𝚵𝐍 𝐑𝚫𝐒𝐇𝐔 𝐌𝐃~ CONNECTED SUCCESSFUL 👨‍💻*

*🌻 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙶𝚁𝙾𝚄𝙿 :*
*╭┈───────────╴╴╴•⟢*
*│URL:* *https://chat.whatsapp.com/BZ6Yzq2TQA9Hl7GovMW1o3*
*╰┈───────────╴╴╴•⟢*
*🌻 𝚈𝙾𝚄𝚃𝚄𝙱𝙴 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 :*
*╭┈───────────╴╴╴•⟢*
*│URL:* *https://youtube.com/@rashumodz_0715?si=5pg_wumwy6VzizMP*
*╰┈───────────╴╴╴•⟢*

*•────────────╴╴╴•⟢*
> *© POWER BY QUEEN RASHU MD*
*•────────────╴╴╴•⟢*`;

conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.ibb.co/BsjkCDP/9555.jpg` }, caption: up })

}
})
conn.ev.on('creds.update', saveCreds)  

conn.ev.on('messages.upsert', async(mek) => {
if (config.ALLWAYS_OFFLINE === "true" && mek.key && mek.key.remoteJid !== 'status@broadcast') {
await conn.readMessages([mek.key]); // Mark the message as read but don't send delivery receipts
}
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
await conn.readMessages([mek.key])
}
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isReact = m.message.reactionMessage ? true : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}

conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }
//AUto Read Function By @Um4r719
conn.ev.on('messages.upsert', async (mek) => {
    try {
        mek = mek.messages[0];
        if (!mek.message) return;

        // Handle ephemeral messages
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
            ? mek.message.ephemeralMessage.message 
            : mek.message;

        // Auto-read functionality
        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]);  // Mark message as read
            console.log(`Marked message from ${mek.key.remoteJid} as read.`);
        }

        // Continue with your existing message processing logic here...
        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const content = JSON.stringify(mek.message);
        const from = mek.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe 
            ? conn.user.id.split(':')[0] + '@s.whatsapp.net' 
            : mek.key.participant || mek.key.remoteJid;

        // More code...
    } catch (err) {
        console.error('Error in message handler:', err);
    }
});
    if (senderNumber.startsWith('212') && config.BAD_NO_BLOCK === "true") {
        console.log(`Blocking number +212${senderNumber.slice(3)}...`);

        // Action: Either block the user or remove them from a group
        if (from.endsWith('@g.us')) {
            // If in a group, remove the user
            await conn.groupParticipantsUpdate(from, [sender], 'remove');
            await conn.sendMessage(from, { text: 'User with +212 number detected and removed from the group.' });
        } else {
            // If in a private chat, block the user
            await conn.updateBlockStatus(sender, 'block');
            console.log(`Blocked +212${senderNumber.slice(3)} successfully.`);
        }

        return; // Stop further processing of this message
    }

    if (config.ANTI_LINK == "true"){
        if (!isOwner && isGroup && isBotAdmins ) {   
        if (body.match(`chat.whatsapp.com`)) {
            
        if (isMe) return await reply("Link Derect but i can't Delete link")
        if(groupAdmins.includes(sender)) return
            
        await conn.sendMessage(from, { delete: mek.key })  
        }}}

    if (config.ANTI_LINKK == "true"){
        if (!isOwner && isGroup && isBotAdmins ) {   
        if (body.match(`chat.whatsapp.com`)) {
            
        if (isMe) return await reply("Link Derect but i can't Delete link")
        if(groupAdmins.includes(sender)) return
            
        await conn.sendMessage(from, { delete: mek.key })
        await conn.groupParticipantsUpdate(from,[sender], 'remove')  
        }}}

    
const bad = await fetchJson(`https://raw.githubusercontent.com/KING-RASHMIKA/AutoFunction/refs/heads/main/bad_words.json`)
if (config.ANTI_BAD == "true"){
  if (!isAdmins && !isMe) {
  for (any in bad){
  if (body.toLowerCase().includes(bad[any])){  
    if (!body.includes('tent')) {
      if (!body.includes('docu')) {
        if (!body.includes('https')) {
  if (groupAdmins.includes(sender)) return 
  if (mek.key.fromMe) return   
  await conn.sendMessage(from, { delete: mek.key })  
  await conn.sendMessage(from , { text: '*Bad word detected..!*'})
//  await conn.groupParticipantsUpdate(from,[sender], 'remove')
  }}}}}}}
  
 if (config.ANTI_BOT == "true"){
  if ( isGroup && !isAdmins && !isMe && !isOwner && isBotAdmins ) {
  if ( mek.id.startsWith("BAE") ) {
await conn.sendMessage(from, { text: "❌ ```Another Bot's message Detected :``` 💥 *Removed By Queen Rashu Md* ❗\nAnti Bot System on..." })
if ( config.ANTI_BOT == "true" && isBotAdmins ) {
await conn.sendMessage(from, { delete: mek.key })
await conn.groupParticipantsUpdate(from,[sender], 'remove')
  }}
    if ( mek.id.startsWith("QUEENAMDI") ) {
await conn.sendMessage(from, { text: "❌ ```Another Bot's message Detected :``` *💥 QUEEN RASHU MD* ❗\n*Removed By QUEEN RASHU MD* ❗\nAnti Bot System on..." })
if ( config.ANTI_BOT == "true" && isBotAdmins ) {
await conn.sendMessage(from, { delete: mek.key })
await conn.groupParticipantsUpdate(from,[sender], 'remove')
  }}

  
  }
  }
  
//============================================================================

switch (command) {
                case 'jid':
                    reply(from)
                    break
                case 'device': {
                    let deviceq = getDevice(mek.message.extendedTextMessage.contextInfo.stanzaId)

                    reply("*He Is Using* _*Whatsapp " + deviceq + " version*_")
                }
                break
                default:
            }

//================ownerreact==============
if(senderNumber.includes("94727319036")){
if(isReact) return
m.react("🎉")
}
if(senderNumber.includes("94778059333")){
if(isReact) return
m.react("🎉")
}
       if (config.ALLWAYS_OFFLINE === "true") {
        conn.sendPresenceUpdate('unavailable'); // Sets the bot's last seen status
    }


//=================================WORKTYPE=========================================== 
if(!isOwner && config.MODE === "private") return
if(!isOwner && isGroup && config.MODE === "inbox") return
if(!isOwner && isGroup && config.MODE === "groups") return
//======================================================

             
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] " + e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})
}
app.get("/", (req, res) => {
res.send("Queen Rashu Md Bot, bot started✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);  
