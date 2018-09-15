'use strict';

const bookshelf = require('./bookshelf');

class User extends bookshelf.Model {
  get tableName() {
    return 'users';
  }

  get hasTimestamps() {
    return true;
  }

  triggers() {
    return this.hasMany('Trigger', 'user_id');
  }

  recipients() {
<<<<<<< Updated upstream
    return this.hasMany('Recipient', 'sender_id');
=======
    return this.hasMany('Recipient', 'sender_id','id');
>>>>>>> Stashed changes
  }

  packages() {
    return this.hasMany('Package', 'package_maker_id');
  }
}

module.exports = bookshelf.model('User', User);
