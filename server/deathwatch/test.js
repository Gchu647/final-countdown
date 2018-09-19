const queue = require('./activeQueue');
const fs = require('fs');
const EncryptedFile = require('../db/models/EncryptedFile');
const { Buffer } = require('buffer');
const e = require('./encrypt.js');
const d = require('./decrypt.js');
const crypto = require('crypto');

let count = 0;

const encodeDecodeTest = function() {
  return EncryptedFile.fetchAll()
    .then(files => {
      files = files.toJSON();
      console.log(files);
      let editedFiles = files.map(file => {
        console.log('file', file);
        file.aws_url = e(
          file.aws_url,
          '$2b$12$BSeLwzMj1MsNxQHKISC6ued0tILO5WyoMiRvjSmBTygKJaf9fteQC'
        );
        file.aws_url = d(
          file.aws_url,
          '$2b$12$BSeLwzMj1MsNxQHKISC6ued0tILO5WyoMiRvjSmBTygKJaf9fteQC'
        );
        console.log('file', file);
        return new EncryptedFile({ id: file.id }).save(
          { aws_url: file.aws_url },
          { patch: true }
        );
      });
      return editedFiles;
    })
    .catch(err => {
      console.log('error', err);
    });
};
encodeDecodeTest();

/* Basic Functionality tests to be converted to chai and mocha */
// let queue = new ActiveTriggerQueue();
// console.log('Initial', queue);
// queue.insertToQueue({ userId: 1, timeToExecute: Date.now() });
// console.log('Insert', queue);

// console.log('search', queue.search(1));
// let tomorrow = new Date();
// tomorrow.setDate(tomorrow.getDate() + 1);
// queue.insertToQueue({ userId: 2, timeToExecute: tomorrow });
// console.log('Insert2', queue);
// let dayAfterTomorrow = new Date();
// dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
// queue.insertToQueue({ userId: 3, timeToExecute: dayAfterTomorrow });
// console.log('Insert3', queue);
// let dayAfterAfter = new Date();
// dayAfterAfter.setDate(dayAfterAfter.getDate() + 3);
// queue.insertToQueue({ userId: 4, timeToExecute: dayAfterAfter });
// console.log('Insert4', queue);
// let yesterday = new Date();
// yesterday.setDate(yesterday.getDate() - 1);
// console.log('yesterday', yesterday);
// queue.insertToQueue({ userId: 0, timeToExecute: yesterday });
// console.log('Insert5', queue);
// //DELETE FROM THE FRONT
// queue.delete(0);
// console.log('Delete 1', queue);
// //DELETE FROM THE BACK
// queue.delete(4);
// console.log('Delete 2', queue);
// let dayAfterAfterAfter = new Date();
// dayAfterAfterAfter.setDate(dayAfterAfterAfter.getDate() + 4);
// queue.edit(1, dayAfterAfterAfter);
// console.log('Edit 1', queue);
// let day4A = new Date();
// day4A.setDate(day4A.getDate() + 5);
// queue.edit(2, day4A);
// console.log('Edit 2', queue);
// let day5A = new Date();
// day5A.setDate(day5A.getDate() + 6);
// queue.edit(3, day5A);
// console.log('Edit 3', queue);

module.exports = queue;
