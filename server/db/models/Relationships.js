'use strict';

const bookshelf = require('./bookshelf');

class Relationship extends bookshelf.Model {
  get tableName() {
    return 'relationships';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('Relationship', Relationship);