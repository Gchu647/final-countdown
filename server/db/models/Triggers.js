'use strict';

const bookshelf = require('./bookshelf');

class Trigger extends bookshelf.Model {
  get tableName() {
    return 'triggers';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('Trigger', Trigger);