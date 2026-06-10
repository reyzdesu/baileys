<div align="center">

# 🌿 Baileys — reyzdesu/baileys

**Modified & Enhanced WhatsApp Web API Library**

[![GitHub](https://img.shields.io/badge/GitHub-reyzdesu%2Fbaileys-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/reyzdesu/baileys)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

A heavily modified fork of Baileys with the latest button support, newsletter improvements, smart rate-limit protection, and a polished developer experience.

Based on [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys).

</div>

---

## ✨ What's Different in This Fork

| Feature | WhiskeySockets/Baileys | reyzdesu/baileys |
|---|:---:|:---:|
| Native Flow Buttons (v9) | ✅ | ✅ |
| `buttonsMessage` direct support | ❌ | ✅ |
| `orderStatus` interactive message | ❌ | ✅ |
| `richMessage` (AI-style rich content) | ❌ | ✅ |
| Location thumbnail auto-resize | ❌ | ✅ |
| Newsletter `mediatype` fix | ❌ | ✅ |
| Smart send queue (anti rate-limit) | ❌ | ✅ |
| Burst protection per JID | ❌ | ✅ |
| Beautiful startup banner | ❌ | ✅ |

---

## 📦 Install

```bash
npm install github:reyzdesu/baileys
```

Then import:

```js
// CommonJS
const { default: makeWASocket } = require('baileys')

// ESM
import makeWASocket from 'baileys'
```

---

## 🔌 Connecting

### QR Code

```js
const { default: makeWASocket, useMultiFileAuthState } = require('baileys')

const { state, saveCreds } = await useMultiFileAuthState('auth_info')

const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,
})

conn.ev.on('creds.update', saveCreds)
```

### Pairing Code

```js
const conn = makeWASocket({
    auth: state,
    printQRInTerminal: false,
})

if (!conn.authState.creds.registered) {
    const code = await conn.requestPairingCode('628xxxxxxxxxx') // no + sign
    console.log('Pairing code:', code)
}
```

---

## ⚡ Smart Send Queue (Anti Rate-Limit)

This fork includes a built-in smart send queue so your bot **won't get rate-limited or crash** when sending messages rapidly.

**How it works:**
- Minimum **300ms** delay between any two messages to the same JID
- If more than **8 messages in 10 seconds** to the same JID → auto cooldown 2s
- If WA returns **429 rate-limit error** → auto backoff 3s before retrying
- All queueing is **transparent** — you call `sendMessage` normally, the queue handles the rest

```js
// No special API needed — just call sendMessage as usual
await conn.sendMessage(jid, { text: 'Hello!' })
await conn.sendMessage(jid, { text: 'World!' }) // auto-queued, won't flood
```

---

## 💬 Sending Messages

### Text

```js
await conn.sendMessage(jid, { text: 'Hello World!' })
```

### Image / Video / Document

```js
await conn.sendMessage(jid, {
    image: { url: './image.jpg' },
    caption: 'Caption here',
})

await conn.sendMessage(jid, {
    video: { url: './video.mp4' },
    caption: 'Video caption',
})

await conn.sendMessage(jid, {
    document: { url: './file.pdf' },
    fileName: 'document.pdf',
    mimetype: 'application/pdf',
})
```

### Audio / PTT

```js
await conn.sendMessage(jid, {
    audio: { url: './audio.mp3' },
    mimetype: 'audio/mp4',
})

await conn.sendMessage(jid, {
    audio: { url: './voice.ogg' },
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true, // voice note
})
```

### Sticker

```js
await conn.sendMessage(jid, {
    sticker: { url: './sticker.webp' },
})
```

### Location

```js
await conn.sendMessage(jid, {
    location: {
        degreesLatitude: -6.2088,
        degreesLongitude: 106.8456,
        name: 'Jakarta',
        address: 'DKI Jakarta, Indonesia',
        jpegThumbnail: './thumbnail.jpg', // auto-resized via sharp
    },
})
```

### Contact

```js
await conn.sendMessage(jid, {
    contacts: {
        displayName: 'John',
        contacts: [{ vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:John\nTEL:+628xxxxxxxxxx\nEND:VCARD' }],
    },
})
```

### React to Message

```js
await conn.sendMessage(jid, {
    react: {
        text: '🔥',
        key: message.key,
    },
})
```

### Quote / Reply

```js
await conn.sendMessage(jid, {
    text: 'This is a reply!',
}, { quoted: message })
```

---

## 🔘 Button Messages (Latest — v9)

This fork has full support for the latest WhatsApp button types.

### Interactive Buttons (Native Flow)

```js
await conn.sendMessage(jid, {
    interactiveMessage: {
        header: {
            title: 'Pilih Menu',
            hasMediaAttachment: false,
        },
        body: { text: 'Silakan pilih salah satu opsi di bawah ini.' },
        footer: { text: 'Powered by Bot' },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({ display_text: 'Opsi 1', id: 'OPT_1' }),
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({ display_text: 'Opsi 2', id: 'OPT_2' }),
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Buka Website',
                        url: 'https://github.com/reyzdesu/baileys',
                        merchant_url: 'https://github.com/reyzdesu/baileys',
                    }),
                },
            ],
            messageParamsJson: '',
        },
    },
})
```

### List Message

```js
await conn.sendMessage(jid, {
    listMessage: {
        title: 'Judul List',
        description: 'Deskripsi list pesan',
        buttonText: 'Pilih Opsi',
        listType: 1,
        sections: [
            {
                title: 'Seksi 1',
                rows: [
                    { title: 'Opsi A', rowId: 'OPT_A', description: 'Deskripsi opsi A' },
                    { title: 'Opsi B', rowId: 'OPT_B', description: 'Deskripsi opsi B' },
                ],
            },
        ],
        footerText: 'Footer text',
    },
})
```

### Direct Buttons Message

```js
await conn.sendMessage(jid, {
    buttonsMessage: {
        contentText: 'Pilih salah satu:',
        footerText: 'Footer',
        headerType: 1,
        buttons: [
            { buttonId: 'BTN_1', buttonText: { displayText: 'Tombol 1' }, type: 1 },
            { buttonId: 'BTN_2', buttonText: { displayText: 'Tombol 2' }, type: 1 },
        ],
    },
})
```

### Interactive with Image Header

```js
await conn.sendMessage(jid, {
    interactiveMessage: {
        header: {
            title: 'Header Gambar',
            hasMediaAttachment: true,
            imageMessage: (await conn.prepareWAMessageMedia(
                { image: { url: './banner.jpg' } },
                { upload: conn.waUploadToServer }
            )).imageMessage,
        },
        body: { text: 'Teks body pesan di sini.' },
        footer: { text: 'Footer teks' },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({ display_text: 'Klik Saya', id: 'CLICK_ME' }),
                },
            ],
        },
    },
})
```

### Handle Button Response

```js
conn.ev.on('messages.upsert', ({ messages }) => {
    for (const msg of messages) {
        const response = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage
        if (response) {
            const id = JSON.parse(response.paramsJson || '{}').id
            console.log('Button clicked:', response.name, 'ID:', id)
        }

        // Legacy buttons response
        const btnRes = msg.message?.buttonsResponseMessage
        if (btnRes) {
            console.log('Button ID:', btnRes.selectedButtonId)
        }

        // List row selected
        const listRes = msg.message?.listResponseMessage
        if (listRes) {
            console.log('Row selected:', listRes.singleSelectReply?.selectedRowId)
        }
    }
})
```

---

## 🛍️ Order Status Message

Send an interactive order status card:

```js
await conn.sendMessage(jid, {
    orderStatus: {
        title: 'Status Pesanan',
        text: 'Pesanan kamu sedang diproses.',
        footer: 'Powered by Bot',
        image: './product.jpg', // URL, path, atau Buffer
        referenceId: 'ORDER-001',
        status: 'PROCESSING', // PROCESSING | SHIPPED | DELIVERED | CANCELLED
        subtotalValue: 50000,
        subtotalOffset: 100,
        taxValue: 0,
        taxOffset: 100,
        currency: 'IDR',
    },
})
```

---

## 🌐 Newsletter

### Follow Channel

```js
await conn.newsletterFollow('120363428307454839@newsletter')
```

### Unfollow Channel

```js
await conn.newsletterUnfollow('120363428307454839@newsletter')
```

### Get Channel Info

```js
const info = await conn.newsletterMetadata('invite', 'channelInviteCode')
console.log(info)
```

### Send Message to Channel

```js
await conn.sendMessage('120363428307454839@newsletter', {
    text: 'Update dari channel!',
})

// With image
await conn.sendMessage('120363428307454839@newsletter', {
    image: { url: './banner.jpg' },
    caption: 'Gambar update',
})

// Interactive message in newsletter (fixed in this fork)
await conn.sendMessage('120363428307454839@newsletter', {
    interactiveMessage: {
        body: { text: 'Pesan interaktif di channel' },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Kunjungi',
                        url: 'https://github.com/reyzdesu/baileys',
                        merchant_url: 'https://github.com/reyzdesu/baileys',
                    }),
                },
            ],
        },
    },
})
```

---

## 👥 Groups

### Create & Manage

```js
// Create group
const group = await conn.groupCreate('Nama Grup', ['628xxxxxxxxxx@s.whatsapp.net'])
console.log('Group ID:', group.gid)

// Get metadata
const meta = await conn.groupMetadata(jid)
console.log(meta)

// Add / remove participants
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'add')
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'remove')

// Promote / demote
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'promote')
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'demote')

// Update subject
await conn.groupUpdateSubject(jid, 'Nama Baru')

// Update description
await conn.groupUpdateDescription(jid, 'Deskripsi baru')

// Leave group
await conn.groupLeave(jid)
```

### Invite Links

```js
const inviteCode = await conn.groupInviteCode(jid)
console.log('Link: https://chat.whatsapp.com/' + inviteCode)

// Revoke
await conn.groupRevokeInvite(jid)

// Join via link
await conn.groupAcceptInvite('inviteCode')
```

---

## 💾 Saving Sessions

```js
const { default: makeWASocket, useMultiFileAuthState } = require('baileys')

const { state, saveCreds } = await useMultiFileAuthState('./sessions/mybot')

const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    // Recommended for group bots:
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    getMessage: async (key) => store.messages[key.remoteJid]?.get(key.id),
})

conn.ev.on('creds.update', saveCreds)
```

---

## 📋 Recommended Config

```js
const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,

    // Keep connection stable
    keepAliveIntervalMs: 25000,
    connectTimeoutMs: 30000,

    // Don't flood WA servers
    retryRequestDelayMs: 500,
    maxMsgRetryCount: 5,

    // Stay invisible (no online indicator)
    markOnlineOnConnect: false,

    // Save RAM on startup
    syncFullHistory: false,

    // Faster group message sends
    cachedGroupMetadata: async (jid) => groupCache.get(jid),

    // Better retries
    getMessage: async (key) => await getMessageFromStore(key),

    // High quality link previews (optional)
    generateHighQualityLinkPreview: false,
})
```

---

## 📡 Events

```js
conn.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) console.log('Scan QR')
    if (connection === 'open') console.log('Connected!')
    if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401
        if (shouldReconnect) reconnect()
    }
})

conn.ev.on('messages.upsert', ({ messages, type }) => {
    for (const msg of messages) {
        if (!msg.message) continue
        console.log('New message from:', msg.key.remoteJid)
    }
})

conn.ev.on('messages.update', (updates) => {
    for (const { key, update } of updates) {
        if (update.status) console.log('Message', key.id, 'status:', update.status)
    }
})

conn.ev.on('group-participants.update', ({ id, participants, action }) => {
    console.log(`Group ${id}: ${action} → ${participants}`)
})

conn.ev.on('creds.update', saveCreds)
```

---

## 🔗 JID Format

| Type | Format | Example |
|---|---|---|
| Private | `number@s.whatsapp.net` | `628123456789@s.whatsapp.net` |
| Group | `id@g.us` | `120363xxxxx@g.us` |
| Newsletter | `id@newsletter` | `120363428307454839@newsletter` |
| Status | `status@broadcast` | — |
| Broadcast | `id@broadcast` | `1234@broadcast` |

---

## 🛡️ Privacy

```js
await conn.updateBlockStatus(jid, 'block')
await conn.updateBlockStatus(jid, 'unblock')

const settings = await conn.fetchPrivacySettings(true)

await conn.updateLastSeenPrivacy('all')     // 'contacts' | 'none'
await conn.updateOnlinePrivacy('all')       // 'match_last_seen'
await conn.updateProfilePicturePrivacy('all')
await conn.updateStatusPrivacy('contacts')
await conn.updateReadReceiptsPrivacy('all') // 'none'
await conn.updateGroupsAddPrivacy('contacts')
```

---

## 🗑️ Delete Messages

```js
// Delete for everyone
await conn.sendMessage(jid, {
    delete: messageKey,
})

// Delete for me
await conn.chatModify({ clear: { messages: [{ id: msgId, fromMe: true }] } }, jid)
```

---

## 📌 Misc

```js
// Read messages
await conn.readMessages([messageKey])

// Typing indicator
await conn.sendPresenceUpdate('composing', jid)
await conn.sendPresenceUpdate('paused', jid)

// Online/offline
await conn.sendPresenceUpdate('available')
await conn.sendPresenceUpdate('unavailable')

// Update profile name
await conn.updateProfileName('My Bot')

// Update profile picture
await conn.updateProfilePicture(conn.user.id, { url: './avatar.jpg' })

// Get profile picture
const ppUrl = await conn.profilePictureUrl(jid, 'image')
```

---

## 📚 Further Reading

- [WhiskeySockets Baileys Docs](https://guide.whiskeysockets.io/)
- [Baileys API Reference](https://baileys.whiskeysockets.io/)
- [WhatsApp Web Protocol](https://github.com/nicolo-ribaudo/whatsapp-web-reveng)

---

<div align="center">
  <b>reyzdesu/baileys</b> — Modified Baileys for serious bot developers
</div>
