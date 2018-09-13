const moment = require('moment');

/*** Active Trigger Queue: This is the linked-list that will represent the trigger queue ***/
function ActiveTriggerQueue() {
  this.head = null;
  this.tail = null;
}

/*** Active Trigger: This is a node in the linked-list that
 * represents an active trigger. Value should be an object
 * containing { userId, timeToExecute} ***/
function ActiveTrigger(value, next) {
  this.value = value;
  this.next = next;
}

/*** Active Trigger Search: This function searches the structure
 * for a specific user's trigger. Uses the userId field to find
 * the trigger.***/
ActiveTriggerQueue.prototype.search = userId => {
  let currentTrigger = this.head;
  while (currentTrigger) {
    if (currentTrigger.value['userId'] === userId) {
      return currentTrigger;
    } else {
      currentTrigger = currentTrigger.next;
    }
  }
  //This will return a trigger or ''
  return currentTrigger;
};

/*** Active Trigger Edit: This function edits an active trigger modifying 
 * the timeToExecute. It returns true if edit was successful else false***/
ActiveTriggerQueue.prototype.edit = (userId, newTimeToExecute) => {
  let triggerBeingEdited = this.search(userId);
  if(triggerBeingEdited){
    triggerBeingEdited.value['timeToExecute'] = newTimeToExecute;
  }
  return triggerBeingEdited ? true : false;
};

/*** Active Trigger Insert: This function inserts a new trigger into
 *  the structure. The trigger is inserted based on timeToExecute***/
ActiveTriggerQueue.prototype.insertToQueue = value => {
  let previousTrigger = '';
  let currentTrigger = this.head;
  //This normalizes the time passed in to UTC
  value['timeToExecute'] = moment.utc(this.value['timeToExecute']).format();

  //This is for the case that the queue is empty.
  if (this.head === '') {
    return (this.head = new ActiveTrigger(value, ''));
  }

  //This is for the case that there is only one element in the queue.
  if (this.head === this.tail) {
    if (this.head.value['timeToExecute'] > value['timeToExecute']) {
      return (this.tail = new ActiveTrigger(value, ''));
    } else {
      let temp = this.head;
      return (this.head = new ActiveTrigger(value, temp));
    }
  }

  let next = '';

  //While currentTrigger exists it will continue executing the loop
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
