'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: 'EAAUY46BVkwsBAA7JYL2F0j3SNqZCni03J4hQVVPWz7JJ0D6dW53IMZBXsfj3E8GV4G1Q08EixlaZBmWnLUjgRmGHl7gnr1S1pZBdnchGvvZBZBwQ5mWPGmFfnt35n3HXEpuYblZCIcZBpKfWLMX6iyXqVTFiVNnHE9tnsYKxfFzWiAZDZD',
  verifyToken: 'mynameissopykt',
  appSecret: '11506adcf4786dfb023deeeb36ca3157'
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  chat.say(`Echo: ${text}`);
});

bot.start();
