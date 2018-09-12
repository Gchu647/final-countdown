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
    this.belongsTo('User', 'sender_id');
  }

  relationship() {
    this.belongsTo('Relationships', 'relationship_id');
  }

  package() {
    this.hasOne('Package', 'recipient_id ');
  }
}

module.exports = bookshelf.model('Recipient', Recipient);