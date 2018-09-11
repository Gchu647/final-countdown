'use strict';

const bookshelf = require('./bookshelf');

class Package extends bookshelf.Model {
  get tableName() {
    return 'packages';
  }

  get hasTimestamps() {
    return true;
  }

  maker() {
    this.belongsTo('User', 'package_maker_id');
  }

  recipient() {
    this.belongsTo('Package', 'recipient_id ');
  }
}

module.exports = bookshelf.model('Package', Package);