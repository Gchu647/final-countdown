'use strict';

const bookshelf = require('./bookshelf');

class State extends bookshelf.Model {
  get tableName() {
    return 'countries';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('State', State);