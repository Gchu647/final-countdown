const moment = require('moment');

function ActiveTriggerQueue() {
  this.head = null;
  this.tail = null;
}

function ActiveTrigger(value, next) {
  this.value = value;
  this.next = next;
}

ActiveTriggerQueue.prototype.search = value => {
  let currentTrigger = this.head;
  while (currentTrigger) {
    if (currentTrigger.value['userId'] === value['userId']) {
      return currentTrigger;
    }
  }
};

ActiveTriggerQueue.prototype.insertToQueue = value => {
  let previousTrigger = '';
  let currentTrigger = this.head;
  value['timeToExecute'] = moment.utc(this.value['timeToExecute']).format();

  if (this.head === '') {
    return (this.head = new ActiveTrigger(value, ''));
  }

  if (this.head === this.tail) {
    if (this.head.value['timeToExecute'] > value['timeToExecute']) {
      return (this.tail = new ActiveTrigger(value, ''));
    } else {
      let temp = this.head;
      return (this.head = new ActiveTrigger(value, temp));
    }
  }

  let next = '';

  while (currentTrigger) {
    if (currentTrigger.value['timeToExecute'] > value['timeToExecute']) {
      return (next = previousTrigger);
    } else {
      previousTrigger = currentTrigger;
      currentTrigger = currentTrigger.next;
    }
  }

  previousTrigger.next = new ActiveTrigger(value, next);
  previousTrigger.next.next = currentTrigger ? currentTrigger : '';
};

module.exports = { ActiveTriggerQueue };
