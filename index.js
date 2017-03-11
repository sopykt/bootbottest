'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: (process.env.MESSENGER_PAGE_ACCESS_TOKEN),
  verifyToken: (process.env.MESSENGER_VALIDATION_TOKEN),
  appSecret: (process.env.MESSENGER_APP_SECRET)
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  //chat.say(`Echo: ${text}`);
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

bot.hear(['food', 'hungry'], (payload, chat) => {
    // Send a text message with quick replies
    chat.say({
        text: 'What do you want to eat today?',
        quickReplies: ['Mexican', 'Italian', 'American', 'Argentine']
    });
    console.log('The user is hungry');
});

//Start a conversation and keep the user's answers in context
bot.hear('ask me something', (payload, chat) => {
    chat.conversation((convo) => {
        askName(convo);
    });

    const askName = (convo) => {
        convo.ask(`What's your name?`, (payload, convo) => {
            const text = payload.message.text;
            convo.set('name', text);
            convo.say(`Oh, your name is ${text}`).then(() => askFavoriteFood(convo));
        });
    };

    const askFavoriteFood = (convo) => {
        convo.ask(`What's your favorite food?`, (payload, convo) => {
            const text = payload.message.text;
            convo.set('food', text);
            convo.say(`Got it, your favorite food is ${text}`).then(() => sendSummary(convo));
        });
    };

    const sendSummary = (convo) => {
        convo.say(`Ok, here's what you told me about you:
          - Name: ${convo.get('name')}
          - Favorite Food: ${convo.get('food')}`);
      convo.end();
    };
});

bot.start();
