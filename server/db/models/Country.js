'use strict';

const bookshelf = require('./bookshelf');

class Country extends bookshelf.Model {
  get tableName() {
    return 'countries';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('Country', Country);