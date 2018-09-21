const moment = require('moment');

exports.seed = function(knex, Promise) {
  // Inserts trigger entries
  return knex('triggers').insert([
    { id: 1, user_id: 1, countdown: moment.utc().add(10, 's') },
    { id: 2, user_id: 2, countdown: moment.utc().add(20, 's') },
    { id: 3, user_id: 3, countdown: moment.utc().add(30, 's') }
  ]);
};
