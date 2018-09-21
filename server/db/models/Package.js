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
    return this.belongsTo('User', 'package_maker_id');
  }

  group() {
    return this.belongsTo('Group', 'package_id');
  }

  file() {
    return this.hasMany('EncryptedFile', 'id', 'file_id');
  }
}

module.exports = bookshelf.model('Package', Package);