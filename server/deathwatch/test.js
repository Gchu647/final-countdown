const queue = require('./activeQueue');
const fs = require('fs');
const EncryptedFile = require('../db/models/EncryptedFile');
const crypto = require('crypto'),
  algorithm = 'aes-256-cbc',
  password = 'passwordpasswordpasswordpassword',
  iv = 'passwordpassword';
let count = 0;
const fileReader = fs.createReadStream(__dirname + '/test.txt');
// const readline = require('readline');

const encrypt = crypto.createCipheriv(algorithm, password, iv);
const decrypt = crypto.createDecipheriv(algorithm, password, iv);

function e(str) {
  let all = encrypt.update(str, 'utf8', 'hex');
  return all += encrypt.final('hex');
}
const enc = function() {
  return EncryptedFile.fetchAll()
    .then(files => {
      files = files.toJSON();
      console.log(files);
      let editedFiles = files.map(file => {
        console.log('file', file);
        file.aws_url = e(file.aws_url);
        console.log('file', file);
        return new EncryptedFile({ id: file.id }).save(
          { aws_url: file.aws_url },
          { patch: true }
        );
      });
      // return editedFiles;
    })

    .catch(err => {
      console.log('error', err);
    });
};
enc();

// const dec = function() {
//   return EncryptedFile.fetchAll()
//     .then(files => {
//       files = files.toJSON();
//       console.log(files);
//       let editedFiles = files.map(file => {
//         console.log('file', file);
//         file.aws_url = decrypt.update(file.aws_url, 'hex', 'utf8');
//         console.log('file', file);
//         // return new EncryptedFile({ id: file.id }).save(
//         //   { aws_url: file.aws_url },
//         //   { patch: true }
//         // );
//       });
//       // return editedFiles;
//     })

//     .catch(err => {
//       console.log('error', err);
//     });
// };
// dec();

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: '\nOHAI> '
// });

// rl.prompt();

// rl.on('line', line => {
//   let enc = encrypt.update(line, 'utf8', 'binary');
//   let dec = decrypt.update(enc, 'binary', 'utf8');
//   // dec += decrypt.final('utf8');
//   switch (line.trim()) {
//   default:
//     console.log(`encrypted ${enc}`);
//     console.log(`decrypted ${dec}`);
//     break;
//   }
//   rl.prompt();
// });

// fileReader.pipe(encrypt).pipe(fileWrite);

// queue.initialize();

// console.log('Initial', queue);
// queue.insertToQueue({ userId: 1, timeToExecute: Date.now() });
// console.log('Insert', queue);

// console.log('search', queue.search(1));
// let tomorrow = new Date();
// tomorrow.setSeconds(tomorrow.getSeconds() + 10);
// queue.insertToQueue({ userId: 2, timeToExecute: tomorrow });
// console.log('Insert2', queue);
// let dayAfterTomorrow = new Date();
// dayAfterTomorrow.setSeconds(dayAfterTomorrow.getSeconds() + 20);
// queue.insertToQueue({ userId: 3, timeToExecute: dayAfterTomorrow });
// console.log('Insert3', queue);
// let dayAfterAfter = new Date();
// dayAfterAfter.setSeconds(dayAfterAfter.getSeconds() + 30);
// queue.insertToQueue({ userId: 4, timeToExecute: dayAfterAfter });
// console.log('Insert4', queue);
// let yesterday = new Date();
// yesterday.setSeconds(yesterday.getSeconds() - 1);
// console.log('yesterday', yesterday);
// queue.insertToQueue({ userId: 0, timeToExecute: yesterday });

module.exports = queue;
