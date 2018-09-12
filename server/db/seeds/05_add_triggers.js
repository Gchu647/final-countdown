
exports.seed = function(knex, Promise) {
    // Inserts trigger entries
    return knex('triggers').insert([
      {id: 1, user_id: 1, custom_countdown: 30},
      {id: 2, user_id: 2, custom_countdown: 20},
      {id: 3, user_id: 3, custom_countdown: 7}
    ]);
};
