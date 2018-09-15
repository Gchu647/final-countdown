const queue = require('./activeQueue');


console.log('Initial', queue);
queue.insertToQueue({ userId: 1, timeToExecute: Date.now() });
console.log('Insert', queue);

console.log('search', queue.search(1));
let tomorrow = new Date();
tomorrow.setSeconds(tomorrow.getSeconds() + 10);
queue.insertToQueue({ userId: 2, timeToExecute: tomorrow });
console.log('Insert2', queue);
let dayAfterTomorrow = new Date();
dayAfterTomorrow.setSeconds(dayAfterTomorrow.getSeconds() + 20);
queue.insertToQueue({ userId: 3, timeToExecute: dayAfterTomorrow });
console.log('Insert3', queue);
let dayAfterAfter = new Date();
dayAfterAfter.setSeconds(dayAfterAfter.getSeconds() + 30);
queue.insertToQueue({ userId: 4, timeToExecute: dayAfterAfter });
console.log('Insert4', queue);
// let yesterday = new Date();
// yesterday.setSeconds(yesterday.getSeconds() - 1);
// console.log('yesterday', yesterday);
// queue.insertToQueue({ userId: 0, timeToExecute: yesterday });


module.exports = queue;