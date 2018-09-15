'use strict';

const bookshelf = require('./bookshelf');

class Group extends bookshelf.Model {
  get tableName() {
    return 'groups';
  }

  get hasTimestamps() {
    return true;
  }

  relationship() {
    return this.hasOne('Relationship', 'id', 'relationship_id');
  }

  package() {
    return this.hasOne('Package', 'id', 'package_id');
  }

  owner() {
    return this.belongsTo('User', 'user_id');
  }

  members() {
    return this.hasMany('Recipient', 'group_id');
  }
}

module.exports = bookshelf.model('Group', Group);
