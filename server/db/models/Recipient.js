'use strict';

const bookshelf = require('./bookshelf');

class Recipient extends bookshelf.Model {
  get tableName() {
    return 'recipients';
  }

  get hasTimestamps() {
    return true;
  }

  sender() {
    return this.belongsTo('User', 'sender_id');
  }

  package() {
    return this.belongsTo('Package', 'package_id');
  }

  group() {
    return this.hasOne('Group', 'id', 'group_id');
  }
}

module.exports = bookshelf.model('Recipient', Recipient);