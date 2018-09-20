'use strict';

const bookshelf = require('./bookshelf');

class State extends bookshelf.Model {
  get tableName() {
    return 'states';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('State', State);