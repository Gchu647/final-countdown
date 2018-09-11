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
}

module.exports = bookshelf.model('User', User);