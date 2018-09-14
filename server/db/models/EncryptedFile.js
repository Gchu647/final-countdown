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
    this.belongsTo('Package', 'packages_id');
  }
}

module.exports = bookshelf.model('EncryptedFile', EncryptedFile);