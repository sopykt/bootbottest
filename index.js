'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: (process.env.MESSENGER_PAGE_ACCESS_TOKEN),
  verifyToken: (process.env.MESSENGER_VALIDATION_TOKEN),
  appSecret: (process.env.MESSENGER_APP_SECRET)
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  chat.say(`Echo: ${text}`);
});

bot.start();
