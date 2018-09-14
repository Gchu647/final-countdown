const { ActiveTriggerQueue } = require('../server/deathwatch/activeQueue');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const mocha = require('mocha');

const aTQ = new ActiveTriggerQueue();

describe('ActiveTriggerQueue', function() {
  let user1 = { userId: 1, timeToExecute: Date.now() };
  let dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  let user2 = { userId: 2, timeToExecute: dayAfterTomorrow };

  describe('constructor', function() {
    it('should return an ActiveTriggerQueue object with a head and tail that are null', function() {
      expect(aTQ.head).to.equal(null);
      expect(aTQ.tail).to.equal(null);
    });
  });
  describe('Insert user1', function() {
    it('should insert the ActiveTrigger into the head and the tail', function() {
      aTQ.insertToQueue(user1);
      expect(aTQ.head.value).to.equal(user1);
    });
  });
  describe('Insert user2', function() {
    it('should insert the ActiveTrigger into the tail and keep the head as is', function() {
      aTQ.insertToQueue(user2);
      expect(aTQ.head.value).to.equal(user1);
      expect(aTQ.tail.value).to.equal(user2);
    });
  });
});
