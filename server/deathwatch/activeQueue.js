const User = require('../db/models/User');
const Recipient = require('../db/models/Recipient');
const Package = require('../db/models/Package');
const EncryptedFile = require('../db/models/EncryptedFile');
const Group = require('../db/models/Group');
const Trigger = require('../db/models/Trigger');
const moment = require('moment');
const crypto = require('crypto'),
  algorithm = 'aes-256-cbc',
  password = 'passwordpasswordpasswordpassword',
  iv = 'passwordpassword';

const encrypt = crypto.createCipheriv(algorithm, password, iv);
const decrypt = crypto.createDecipheriv(algorithm, password, iv);

/*** Active Trigger Queue: This is the linked-list that will represent the trigger queue ***/
class ActiveTriggerQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.lastUpdate = moment.utc(0);
  }

  async getTriggers() {
    console.log('last update', this.lastUpdate);
    return await Trigger.query('where', 'created_at', '>', `${this.lastUpdate}`)
      .fetchAll({ countdown: !null })
      .then(response => {
        console.log('getTriggers response', response);
        return response.toJSON();
      })
      .catch(err => {
        console.log('error: ', err);
      });
  }

  /** ActiveTrigger updateQueue: This function runs periodically and retrieves any new triggers from the trigger
   * database and inserts them into the ActiveTrigger Queue */
  async updateQueue() {
    return await this.getTriggers()
      .then(trigArr => {
        console.log('update', trigArr);
        trigArr.map(trigger => {
          console.log('trigger v last', trigger.created_at, this.lastUpdate);
          if (trigger.created_at > this.lastUpdate) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            this.lastUpdate = trigger.created_at;
          }
          this.insertToQueue({
            userId: trigger.user_id,
            timeToExecute: trigger.countdown
          });
        });
      })
      .catch(err => {
        console.log('Initialization Error:', err);
      });
  }

  /** ActiveTrigger getExecutableTriggers: This function searchs the
   * linkedlist and returns an array of the triggers to execute **/
  async getExecutableTriggers() {
    let executableTriggers = [];
    if (!this.head) {
      return null;
    }
    console.log(
      'head v now',
      this.head.value.timeToExecute,
      moment.utc(Date.now()).format()
    );

    if (this.head.value.timeToExecute < moment.utc(Date.now()).format()) {
      let temp = this.head;
      this.delete(this.head.value.userId);
      console.log('executableTrigger', temp);
      let userInfo;
      return await this.getUserData(temp.value.userId)
        .then(response => {
          userInfo = response.toJSON();
          if (userInfo) {
            console.log('UserInfo', userInfo);
            // console.log('UserInfo.groups.members', userInfo.groups[0].members);
            console.log(`user full name: ${userInfo.f_name} ${userInfo.l_name}`);
            executableTriggers = userInfo.recipients.map(recipient => {
              if (!recipient) {
                return null;
              }
              console.log('recipient', recipient);
              console.log('recipient.package', recipient.package.file[0]);
              let subjectStr = recipient.package.file[0].name;
              let bodyStr = recipient.package.file[0].aws_url;
              // let enc = encrypt.update(bodyStr, 'utf8', 'hex');
              // let dec = decrypt.update(bodyStr, 'hex', 'utf8');
              // console.log('subj enc', enc);
              // console.log('subj dec', dec);
              return {
                recipientName: `${recipient.f_name} ${recipient.l_name}`,
                recipientEmail: recipient.email,
                userFullName: `${userInfo.f_name} ${userInfo.l_name}`,
                relationshipId: recipient.id,
                subject: subjectStr,
                body: bodyStr
              };
            });
            console.log(`recipient ${userInfo.recipients.id}`);
          }
          console.log('executableTriggerArr', executableTriggers);
          return executableTriggers;
        })
        .catch(err => {
          console.log('err: ', err);
        });
    } else {
      return null;
    }
  }

  getUserData(userId) {
    console.log('userId', userId);
    return User.where({ id: userId })
      .fetch({ withRelated: ['recipients.package.file', 'groups.members.package.file'] })
      .then(response => {
        console.log('getUserData response', response);
        return response;
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  /*** ActiveTrigger Search: This function searches the structure
   * for a specific user's trigger. Uses the userId field to find
   * the trigger.***/
  search(userId) {
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
  }

  /*** ActiveTrigger Search Previous: This function searches the structure
   * for a specific user's trigger and returns the previous trigger. Uses the userId field to find
   * the trigger.***/
  searchPrevious(userId) {
    let previousTrigger = '';
    let currentTrigger = this.head;
    while (currentTrigger) {
      if (currentTrigger.value['userId'] === userId) {
        return previousTrigger;
      } else {
        previousTrigger = currentTrigger;
        currentTrigger = currentTrigger.next;
      }
    }
    //This will return a trigger or ''
    return previousTrigger;
  }
  /*** ActiveTrigger Edit: This function edits an active trigger modifying
   * the timeToExecute. It returns true if edit was successful else false***/
  edit(userId, newTimeToExecute) {
    this.delete(userId);
    return this.insertToQueue({ userId, timeToExecute: newTimeToExecute });
  }
  /*** ActiveTrigger Delete: This function deletes an active trigger.
   * It returns true if delete was successful else false***/
  delete(userId) {
    let success = false;
    if (this.head.value.userId === userId) {
      this.head = this.head.next;
      return (success = true);
    }

    let precedingTrigger = this.searchPrevious(userId);

    if (this.tail === precedingTrigger.next) {
      this.tail = precedingTrigger;
      this.tail.next = null;
      return (success = true);
    }

    precedingTrigger = precedingTrigger.next.next;
    success = precedingTrigger ? true : false;

    return success;
  }

  /*** ActiveTrigger Insert: This function inserts a new trigger into
   *  the structure. The trigger is inserted based on timeToExecute***/
  insertToQueue(value) {
    let previousTrigger = null;
    let currentTrigger = this.head;
    //This normalizes the time passed in to UTC
    value.timeToExecute = moment.utc(value.timeToExecute).format();

    //This is for the case that the queue is empty.
    if (!this.head) {
      this.head = this.tail = new ActiveTrigger(value, null);
      return;
    }

    //This is for the case that there is only one element in the queue.
    if (this.head === this.tail) {
      if (this.head.value['timeToExecute'] < value['timeToExecute']) {
        this.head.next = this.tail = new ActiveTrigger(value, '');
        return;
      } else {
        let temp = this.head;
        this.head = new ActiveTrigger(value, temp);
        this.tail = temp;
        return;
      }
    }

    let next = null;

    //While currentTrigger exists it will continue executing the loop
    while (currentTrigger) {
      if (currentTrigger.value['timeToExecute'] > value['timeToExecute']) {
        next = previousTrigger;
        break;
      } else {
        previousTrigger = currentTrigger;
        currentTrigger = currentTrigger.next;
      }
    }

    let newTrigger = new ActiveTrigger(value, next);

    if (!previousTrigger) {
      newTrigger.next = this.head;
      this.head = newTrigger;
    } else if (previousTrigger === this.tail) {
      this.tail = newTrigger;
      previousTrigger.next = newTrigger;
    } else {
      previousTrigger.next = newTrigger;
      newTrigger.next = currentTrigger ? currentTrigger : null;
    }
  }
}

/*** ActiveTrigger: This is a node in the linked-list that
 * represents an active trigger. Value should be an object
 * containing { userId, timeToExecute} ***/
function ActiveTrigger(value, next) {
  this.value = value;
  this.next = next;
}

let queue = new ActiveTriggerQueue();

module.exports = queue;
