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
    return this.hasMany('Trigger', 'user_id');
  }

  recipients() {
    return this.hasMany('Recipient', 'sender_id');
  }

  packages() {
    return this.hasMany('Package', 'package_maker_id');
  }

  groups() {
    return this.hasMany('Group', 'owner_id');
  }
}

module.exports = bookshelf.model('User', User);
