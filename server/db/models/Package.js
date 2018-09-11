'use strict';

const bookshelf = require('./bookshelf');

class Package extends bookshelf.Model {
  get tableName() {
    return 'packages';
  }

  get hasTimestamps() {
    return true;
  }
}

module.exports = bookshelf.model('Package', Package);