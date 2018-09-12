'use strict';

const bookshelf = require('./bookshelf');

class User extends bookshelf.Model {
  get tableName() {
    return 'users';
  }

  get hasTimestamps() {
    return true;
  }

  triggers() {
    this.hasMany('Trigger', 'user_id');
  }

  recipients() {
    this.hasMany('Recipient', 'sender_id');
  }

  packages() {
    this.hasMany('Package', 'package_maker_id');
  }
}

module.exports = bookshelf.model('User', User);