# Baileys - reyzdesu/baileys

Modified & Enhanced WhatsApp Web API Library.
Based on WhiskeySockets/Baileys.

---

## Perbedaan Fork Ini

| Fitur | WhiskeySockets | reyzdesu |
|---|:---:|:---:|
| Native Flow Buttons (v9) | ya | ya |
| buttonsMessage direct | tidak | ya |
| orderStatus interactive | tidak | ya |
| richMessage AI-style | tidak | ya |
| Newsletter mediatype fix | tidak | ya |
| newsletterFollow/Unfollow fix | tidak | ya |
| Smart send queue anti rate-limit | tidak | ya |
| Burst protection per JID | tidak | ya |

---

## Install

```bash
npm install github:reyzdesu/baileys
```

Import:

```js
// CommonJS
const { default: makeWASocket } = require('baileys')

// ESM
import makeWASocket from 'baileys'
```

---

## Koneksi

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
    const code = await conn.requestPairingCode('628xxxxxxxxxx')
    console.log('Kode pairing:', code)
}
```

---

## Konfigurasi yang Direkomendasikan

```js
const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    keepAliveIntervalMs: 25000,
    connectTimeoutMs: 30000,
    retryRequestDelayMs: 500,
    maxMsgRetryCount: 5,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    getMessage: async (key) => await getMessageFromStore(key),
})
```

---

## Smart Send Queue

Built-in queue otomatis mencegah rate-limit saat kirim pesan cepat.

- Minimum delay 300ms antar pesan ke JID yang sama
- Lebih dari 8 pesan dalam 10 detik ke JID yang sama, auto cooldown 2s
- WA return 429, auto backoff 3s sebelum retry
- Transparan, tidak perlu API khusus

```js
await conn.sendMessage(jid, { text: 'Pesan 1' })
await conn.sendMessage(jid, { text: 'Pesan 2' }) // otomatis di-queue
```

---

## Kirim Pesan

### Teks

```js
await conn.sendMessage(jid, { text: 'Hello World!' })
```

### Gambar / Video / Dokumen

```js
await conn.sendMessage(jid, {
    image: { url: './image.jpg' },
    caption: 'Caption',
})

await conn.sendMessage(jid, {
    video: { url: './video.mp4' },
    caption: 'Video',
})

await conn.sendMessage(jid, {
    document: { url: './file.pdf' },
    fileName: 'dokumen.pdf',
    mimetype: 'application/pdf',
})
```

### Audio / Voice Note

```js
await conn.sendMessage(jid, {
    audio: { url: './audio.mp3' },
    mimetype: 'audio/mp4',
})

await conn.sendMessage(jid, {
    audio: { url: './voice.ogg' },
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true,
})
```

### Sticker

```js
await conn.sendMessage(jid, {
    sticker: { url: './sticker.webp' },
})
```

### Lokasi

```js
await conn.sendMessage(jid, {
    location: {
        degreesLatitude: -6.2088,
        degreesLongitude: 106.8456,
        name: 'Jakarta',
        address: 'DKI Jakarta, Indonesia',
    },
})
```

### Kontak

```js
await conn.sendMessage(jid, {
    contacts: {
        displayName: 'John',
        contacts: [{ vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:John\nTEL:+628xxxxxxxxxx\nEND:VCARD' }],
    },
})
```

### Reaksi

```js
await conn.sendMessage(jid, {
    react: {
        text: '🔥',
        key: message.key,
    },
})
```

### Reply / Quote

```js
await conn.sendMessage(jid, { text: 'Ini balasan' }, { quoted: message })
```

---

## Tombol (Button Messages)

### Interactive Buttons - Native Flow (v9)

```js
await conn.sendMessage(jid, {
    interactiveMessage: {
        header: {
            title: 'Pilih Menu',
            hasMediaAttachment: false,
        },
        body: { text: 'Silakan pilih opsi di bawah.' },
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
        description: 'Deskripsi',
        buttonText: 'Pilih Opsi',
        listType: 1,
        sections: [
            {
                title: 'Seksi 1',
                rows: [
                    { title: 'Opsi A', rowId: 'OPT_A', description: 'Deskripsi A' },
                    { title: 'Opsi B', rowId: 'OPT_B', description: 'Deskripsi B' },
                ],
            },
        ],
        footerText: 'Footer',
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

### Interactive dengan Header Gambar

```js
await conn.sendMessage(jid, {
    interactiveMessage: {
        header: {
            title: 'Header',
            hasMediaAttachment: true,
            imageMessage: (await conn.prepareWAMessageMedia(
                { image: { url: './banner.jpg' } },
                { upload: conn.waUploadToServer }
            )).imageMessage,
        },
        body: { text: 'Teks body.' },
        footer: { text: 'Footer' },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({ display_text: 'Klik', id: 'CLICK' }),
                },
            ],
        },
    },
})
```

### Handle Respons Tombol

```js
conn.ev.on('messages.upsert', ({ messages }) => {
    for (const msg of messages) {
        const response = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage
        if (response) {
            const id = JSON.parse(response.paramsJson || '{}').id
            console.log('Tombol ditekan:', response.name, '| ID:', id)
        }

        const btnRes = msg.message?.buttonsResponseMessage
        if (btnRes) {
            console.log('Button ID:', btnRes.selectedButtonId)
        }

        const listRes = msg.message?.listResponseMessage
        if (listRes) {
            console.log('Row dipilih:', listRes.singleSelectReply?.selectedRowId)
        }
    }
})
```

---

## Order Status Message

```js
await conn.sendMessage(jid, {
    orderStatus: {
        title: 'Status Pesanan',
        text: 'Pesanan sedang diproses.',
        footer: 'Powered by Bot',
        image: './product.jpg',
        referenceId: 'ORDER-001',
        status: 'PROCESSING',
        subtotalValue: 50000,
        subtotalOffset: 100,
        taxValue: 0,
        taxOffset: 100,
        currency: 'IDR',
    },
})
```

---

## Newsletter

### Follow Channel

```js
await conn.newsletterFollow('120363406440785559@newsletter')
```

### Unfollow Channel

```js
await conn.newsletterUnfollow('120363406440785559@newsletter')
```

### Mute / Unmute Channel

```js
await conn.newsletterMute('120363406440785559@newsletter')
await conn.newsletterUnmute('120363406440785559@newsletter')
```

### Info Channel

```js
const info = await conn.newsletterMetadata('invite', 'channelInviteCode')
console.log(info)

// atau via JID langsung
const info2 = await conn.newsletterMetadata('id', '120363406440785559@newsletter')
```

### Kirim Pesan ke Channel

```js
await conn.sendMessage('120363406440785559@newsletter', {
    text: 'Update dari channel!',
})

await conn.sendMessage('120363406440785559@newsletter', {
    image: { url: './banner.jpg' },
    caption: 'Gambar update',
})
```

### Update Channel

```js
await conn.newsletterUpdateName('120363406440785559@newsletter', 'Nama Baru')
await conn.newsletterUpdateDescription('120363406440785559@newsletter', 'Deskripsi baru')
await conn.newsletterUpdatePicture('120363406440785559@newsletter', fs.readFileSync('./photo.jpg'))
await conn.newsletterRemovePicture('120363406440785559@newsletter')
```

### Delete Channel

```js
await conn.newsletterDelete('120363406440785559@newsletter')
```

---

## Grup

### Buat & Kelola

```js
const group = await conn.groupCreate('Nama Grup', ['628xxxxxxxxxx@s.whatsapp.net'])
console.log('Group ID:', group.gid)

const meta = await conn.groupMetadata(jid)

await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'add')
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'remove')
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'promote')
await conn.groupParticipantsUpdate(jid, ['628xxxxxxxxxx@s.whatsapp.net'], 'demote')

await conn.groupUpdateSubject(jid, 'Nama Baru')
await conn.groupUpdateDescription(jid, 'Deskripsi baru')
await conn.groupLeave(jid)
```

### Invite Link

```js
const inviteCode = await conn.groupInviteCode(jid)
console.log('Link: https://chat.whatsapp.com/' + inviteCode)

await conn.groupRevokeInvite(jid)
await conn.groupAcceptInvite('inviteCode')
```

---

## Simpan Sesi

```js
const { state, saveCreds } = await useMultiFileAuthState('./sessions/mybot')

const conn = makeWASocket({ auth: state })

conn.ev.on('creds.update', saveCreds)
```

---

## Events

```js
conn.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) console.log('Scan QR')
    if (connection === 'open') console.log('Terhubung!')
    if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401
        if (shouldReconnect) reconnect()
    }
})

conn.ev.on('messages.upsert', ({ messages, type }) => {
    for (const msg of messages) {
        if (!msg.message) continue
        console.log('Pesan baru dari:', msg.key.remoteJid)
    }
})

conn.ev.on('messages.update', (updates) => {
    for (const { key, update } of updates) {
        if (update.status) console.log('Status pesan', key.id, ':', update.status)
    }
})

conn.ev.on('group-participants.update', ({ id, participants, action }) => {
    console.log(`Grup ${id}: ${action} -> ${participants}`)
})

conn.ev.on('creds.update', saveCreds)
```

---

## Format JID

| Tipe | Format | Contoh |
|---|---|---|
| Private | number@s.whatsapp.net | 628123456789@s.whatsapp.net |
| Grup | id@g.us | 120363xxxxx@g.us |
| Newsletter | id@newsletter | 120363406440785559@newsletter |
| Status | status@broadcast | - |

---

## Privasi

```js
await conn.updateBlockStatus(jid, 'block')
await conn.updateBlockStatus(jid, 'unblock')

const settings = await conn.fetchPrivacySettings(true)

await conn.updateLastSeenPrivacy('all')
await conn.updateOnlinePrivacy('all')
await conn.updateProfilePicturePrivacy('all')
await conn.updateStatusPrivacy('contacts')
await conn.updateReadReceiptsPrivacy('all')
await conn.updateGroupsAddPrivacy('contacts')
```

---

## Hapus Pesan

```js
// Hapus untuk semua
await conn.sendMessage(jid, { delete: messageKey })

// Hapus untuk diri sendiri
await conn.chatModify({ clear: { messages: [{ id: msgId, fromMe: true }] } }, jid)
```

---

## Lain-lain

```js
await conn.readMessages([messageKey])

await conn.sendPresenceUpdate('composing', jid)
await conn.sendPresenceUpdate('paused', jid)

await conn.updateProfileName('My Bot')
await conn.updateProfilePicture(conn.user.id, { url: './avatar.jpg' })

const ppUrl = await conn.profilePictureUrl(jid, 'image')
```

---

## Referensi

- WhiskeySockets Baileys Docs: https://guide.whiskeysockets.io/
- Baileys API Reference: https://baileys.whiskeysockets.io/

---

Terima kasih telah memakai Baileys reyzdesu/baileys.
