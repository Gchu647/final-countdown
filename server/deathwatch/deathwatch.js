const { ActiveTriggerQueue } = require('./activeQueue');


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