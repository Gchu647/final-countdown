'use strict';

const bookshelf = require('./bookshelf');

class EncryptedFile extends bookshelf.Model {
  get tableName() {
    return 'encrypted_files';
  }

  get hasTimestamps() {
    return true;
  }

  package() {
    return this.belongsTo('Package', 'package_id');
  }
}

module.exports = bookshelf.model('EncryptedFile', EncryptedFile);