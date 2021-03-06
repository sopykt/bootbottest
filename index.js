'use strict';
const BootBot = require('bootbot');
//const config = require('config');
const fetch = require('node-fetch');
const GIPHY_URL = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=`;
//const echoModule = require('./modules/echo');
//for env variable
require('dotenv').config()

//for static website
// const serveStatic = require('serve-static')


//servestatic for assets
//app.use(serveStatic(__dirname + '/public', {
//  maxAge: '1d',
//  setHeaders: setCustomCacheControl
// }))

const bot = new BootBot({
  accessToken: (process.env.MESSENGER_PAGE_ACCESS_TOKEN),
  verifyToken: (process.env.MESSENGER_VALIDATION_TOKEN),
  appSecret: (process.env.MESSENGER_APP_SECRET)
});

//bot.module(echoModule);

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  //chat.say(`Echo: ${text}`);
  console.log(`The user said: ${text}`);
});

// Subscribe to messages sent by the user with the bot.on() and bot.hear() methods:
//bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
//   console.log('The user said "hello", "hi", "hey", or "hey there"');
//    // Send a text message followed by another text message that contains a typing indicator
//    chat.say('Hello, human friend!').then(() => {
//        chat.say('How are you today?', { typing: true });
//    });
//});

bot.hear(['food', 'hungry'], (payload, chat) => {
    // Send a text message with quick replies
    chat.say({
        text: 'What do you want to eat today?',
        quickReplies: ['Mexican', 'Italian', 'American', 'Argentine']
    });
    console.log('The user is hungry');
});

//Start a conversation and keep the user's answers in context
const askName = (convo) => {
  convo.ask(`Hello! What's your name?`, (payload, convo, data) => {
    const text = payload.message.text;
    convo.set('name', text);
    convo.say(`Oh, your name is ${text}`).then(() => askFavoriteFood(convo));
  });
};

const askFavoriteFood = (convo) => {
  convo.ask(`What's your favorite food?`, (payload, convo, data) => {
    const text = payload.message.text;
    convo.set('food', text);
    convo.say(`Got it, your favorite food is ${text}`).then(() => askGender(convo));
  });
};

const askGender = (convo) => {
  convo.ask((convo) => {
    const buttons = [
      { type: 'postback', title: 'Male', payload: 'GENDER_MALE' },
      { type: 'postback', title: 'Female', payload: 'GENDER_FEMALE' },
      { type: 'postback', title: 'I don\'t wanna say', payload: 'GENDER_UNKNOWN' }
    ];
    convo.sendButtonTemplate(`Are you a boy or a girl?`, buttons);
  }, (payload, convo, data) => {
    const text = payload.message.text;
    convo.set('gender', text);
    convo.say(`Great, you are a ${text}`).then(() => askAge(convo));
  }, [
    {
      event: 'postback:GENDER_FEMALE',
      callback: (payload, convo) => {
        convo.say('You are a Female').then(() => askAge(convo));
        convo.set('gender', 'Female');
      }
    },
    {
      event: 'postback:GENDER_UNKNOWN',
      callback: (payload, convo) => {
        convo.say('OK You don\'t wanna say').then(() => askAge(convo));
		convo.set('gender', 'Unknown');
      }
    },
    {
      event: 'postback:GENDER_MALE',
      callback: (payload, convo) => {
        convo.say('You said you are a Male').then(() => askAge(convo));
        convo.set('gender', 'Male');
      }
    },
    {
      event: 'quick_reply',
      callback: () => {}
    },
    {
      event: 'quick_reply:COLOR_BLUE',
      callback: () => {}
    },
    {
      pattern: ['yes', /yea(h)?/i, 'yup'],
      callback: () => {
        convo.say('You said YES!').then(() => askAge(convo));
      }
    }
  ]);
};

const askAge = (convo) => {
  convo.ask(`Final question. How old are you?`, (payload, convo, data) => {
    const text = payload.message.text;
    convo.set('age', text);
    convo.say(`That's great!`).then(() => {
      convo.say(`Ok, here's what you told me about you:
      - Name: ${convo.get('name')}
      - Favorite Food: ${convo.get('food')}
      - Gender: ${convo.get('gender')}
      - Age: ${convo.get('age')}
      `);
      convo.end();
    });
  });
};

bot.hear('hello', (payload, chat) => {
  chat.conversation((convo) => {
    convo.sendTypingIndicator(1000).then(() => askName(convo));
  });
});

bot.hear('convo', (payload, chat) => {
  chat.conversation(convo => {
    convo.ask({
      text: 'Favorite color?',
      quickReplies: [ 'Red', 'Blue', 'Green' ]
    }, (payload, convo) => {
      const text = payload.message.text;
      convo.say(`Oh your favorite color is ${text}, cool!`);
      convo.end();
    }, [
      {
        event: 'quick_reply',
        callback: (payload, convo) => {
          const text = payload.message.text;
          convo.say(`Thanks for choosing one of the options. Your favorite color is ${text}.`);
          convo.end();
        }
      }
    ]);
  });
});

bot.hear(/gif (.*)/i, (payload, chat, data) => {
  const query = data.match[1];
  chat.say('Searching for the perfect gif...');
  fetch(GIPHY_URL + query)
    .then(res => res.json())
    .then(json => {
      chat.say({
        attachment: 'image',
        url: json.data.image_url
      }, {
        typing: true
      });
    });
});

bot.hear(/(.*) gif/i, (payload, chat, data) => {
  const query = data.match[1];
  chat.say('Searching for the perfect gif...');
  fetch(GIPHY_URL + query)
    .then(res => res.json())
    .then(json => {
      chat.say({
        attachment: 'image',
        url: json.data.image_url
      }, {
        typing: true
      });
    });
});

bot.hear('what\'s my name\?', (payload, chat) => {
  chat.getUserProfile().then((user) => {
    chat.say(`Your name is ${user.first_name} ${user.last_name}!`);
  });
});

bot.start();
