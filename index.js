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
  console.log(`The user said: ${text}`);
});

// Subscribe to messages sent by the user with the bot.on() and bot.hear() methods:
bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
    console.log('The user said "hello", "hi", "hey", or "hey there"');
    // Send a text message followed by another text message that contains a typing indicator
    chat.say('Hello, human friend!').then(() => {
        chat.say('How are you today?', { typing: true });
    });
});

bot.start();
