const User = require('../db/models/User');
const Recipient = require('../db/models/Recipient');
const Package = require('../db/models/Package');
const EncryptedFile = require('../db/models/EncryptedFile');
const Group = require('../db/models/Group');
const Trigger = require('../db/models/Trigger');
const moment = require('moment');
const types = require('pg').types;
const crypto = require('crypto'),
  algorithm = 'aes-256-cbc',
  password = 'passwordpasswordpasswordpassword',
  iv = 'passwordpassword';

// types.setTypeParser(1114, str => {
//   return moment.utc(str).format();
// });

const encrypt = crypto.createCipheriv(algorithm, password, iv);
const decrypt = crypto.createDecipheriv(algorithm, password, iv);

/*** Active Trigger Queue: This is the linked-list that will represent the trigger queue ***/
class ActiveTriggerQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.lastUpdate = moment.utc(0);
    this.lastChange = false;
    this.first = true;
  }

  async getTriggers() {
    return await Trigger.query('whereNotNull', 'countdown')
      .fetchAll()
      .then(response => {
        if (response) {
          return response.toJSON();
        }
        return null;
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
        trigArr = trigArr.filter(trigger => {
          return trigger.created_at > this.lastUpdate;
        });
        if (trigArr.length < 1) {
          console.log(`No new updates since  ${this.lastUpdate}`);
          return null;
        }
        console.log('update', trigArr);
        trigArr.map(trigger => {
          console.log(
            'trigger v last',
            trigger.created_at,
            this.lastUpdate,
            trigger.created_at > this.lastUpdate
          );
          if (trigger.created_at > this.lastUpdate) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            this.lastUpdate = trigger.created_at;
            this.lastChange = !this.lastChange;
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
    let executableTriggerIndividuals = [];
    let executableTriggerGroups = [];
    if (!this.head) {
      return null;
    }

    console.log(
      'top trigger send',
      moment.utc(this.head.value.timeToExecute) < moment.utc(),
      'tte',
      this.head.value.timeToExecute,
      'now',
      moment.utc()
    );

    if (moment.utc(this.head.value.timeToExecute) < moment.utc()) {
      let temp = this.head;
      this.delete(this.head.value.userId);
      let userInfo;
      return await this.getUserData(temp.value.userId)
        .then(response => {
          userInfo = response.toJSON();
          if (userInfo.recipients) {
            executableTriggerIndividuals = userInfo.recipients.map(recipient => {
              if (!recipient) {
                return null;
              }
              let subjectStr = recipient.package.file[0].name;
              let bodyStr = recipient.package.file[0].aws_url;

              return {
                recipientName: `${recipient.f_name} ${recipient.l_name}`,
                recipientEmail: recipient.email,
                userFullName: `${userInfo.f_name} ${userInfo.l_name}`,
                relationshipId: recipient.id,
                subject: subjectStr,
                body: bodyStr,
                hash: `${userInfo.password}`
              };
            });
          }

          if (userInfo.groups) {
            console.log('userInfo.groups', userInfo.groups);
            executableTriggerGroups = userInfo.groups.map(group => {
              if (group.members.length < 1) {
                console.log('no members');
                return null;
              }else {
                let bodyStr = group.members.package.file[0].aws_url;
                let subjectStr = group.members.package.file[0].name;

                return group.members.map(member => {
                  return {
                    recipientName: `${member.f_name} ${member.l_name}`,
                    recipientEmail: member.email,
                    userFullName: `${userInfo.f_name} ${userInfo.l_name}`,
                    relationshipId: member.id,
                    subject: subjectStr,
                    body: bodyStr,
                    hash: `${userInfo.password}`
                  };
                });
              }
            });
          }
          return executableTriggerIndividuals.concat(executableTriggerGroups);
        })
        .catch(err => {
          console.log('err: ', err);
        });
    } else {
      return null;
    }
  }

  getUserData(userId) {
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
      if (this.head.next) {
        this.head = this.head.next;
      } else {
        this.head = this.tail = null;
      }
      this.deleteTriggerFromDB(userId);
      return (success = true);
    }
    let precedingTrigger = this.searchPrevious(userId);

    if (this.tail === precedingTrigger.next) {
      this.tail = precedingTrigger;
      this.tail.next = null;
      this.deleteTriggerFromDB(userId);
      return (success = true);
    }

    precedingTrigger = precedingTrigger.next.next;
    success = precedingTrigger ? true : false;
    if (success) {
      this.deleteTriggerFromDB(userId);
    }

    return success;
  }

  deleteTriggerFromDB(userId) {
    return new Trigger()
      .where({ id: userId })
      .save({ countdown: null }, { patch: true })
      .then(response => {
        console.log('delete model response', response);
      })
      .catch(err => {
        console.log('delete Error: ', err);
      });
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
