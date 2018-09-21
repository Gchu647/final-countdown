require('dotenv').config({ path: '../../.env' });
// const triggerQueue = require('./test.js');
const triggerQueue = require('./activeQueue');
const schedule = require('node-schedule');
const mailgun = require('mailgun.js');
const moment = require('moment');
const types = require('pg').types;
const decrypt = require('./decrypt');
const mg = mailgun.client({
  key: process.env.MAILGUN_KEY,
  username: process.env.MAILGUN_USERNAME,
  domain: process.env.MAILGUN_DOMAIN
});

types.setTypeParser(1114, str => {
  return moment.utc(str).format();
});

let count = 0;
let recipientArr;

const deathWatch = schedule.scheduleJob('* * * * * *', async function() {
  triggerQueue.updateQueue();
  // console.log(triggerQueue);
  // console.log('count: ', count, 'current time: ', moment.utc().format());
  recipientArr = await triggerQueue.getExecutableTriggers().catch(err => {
    console.log('top trigger error', err);
  });
  // console.log('recip', recipientArr);
  if (recipientArr !== null) {
    // console.log('count: ', count, 'triggers', recipientArr);
    // console.log('executeableTrigger', recipientArr);
    // console.log('if recip', recipientArr);
    recipientArr.map(recipient => {
      // console.log('recipient', recipient);
      sendMessages(recipient)
        .then(response => {
          console.log('sendMessageStatus', response);
        })
        .catch(err => {
          console.log('recipient error:', err);
        });
    });
  }
  count += 1;
});

const sendMessages = function(recipientArray) {
  // console.log('send triggered', recipientArray);
  if (!recipientArray || !recipientArray.recipientName) {
    return null;
  }
  console.log('recipArr', recipientArray);
  let decryptedText = decrypt(recipientArray.body, recipientArray.hash);
  // console.log('dec', decrypt(recipientArray.body, recipientArray.hash));
  validateTriggerActive(recipientArray.userId);
  return mg.messages
    .create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_NOREPLY,
      to: `${recipientArray.recipientEmail}`,
      subject: `${recipientArray.subject}`,
      text: `${decryptedText}`,
      // text: `${recipientArray.body}`,
      //${recipientArray.userFullName} To: ${
      //recipientArray.recipientName
      //}
      html: `<h3>Dear ${recipientArray.recipientName}, </h3>
       <h3>${decryptedText} </h3>
       <h3>Sincerely, ${recipientArray.userFullName}</h3>
       Sent:${moment.utc().format()}`
    })
    .then(msg => console.log(msg))
    .catch(err => console.log(err));
};

const validateTriggerActive = function(userId) {
  return Trigger({ user_id: userId })
    .fetch()
    .then(trigger => {
      console.log('trigger', trigger);
    });
};
