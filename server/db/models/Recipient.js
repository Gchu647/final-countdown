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

  relationship() {
    return this.belongsTo('Relationships', 'relationship_id');
  }

  package() {
    return this.hasOne('Package', 'recipient_id');
  }
}

module.exports = bookshelf.model('Recipient', Recipient);