'use strict';

const bookshelf = require('./bookshelf');

class Recipient extends bookshelf.Model {
  get tableName() {
    return 'recipients';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('Recipient', Recipient);