
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('triggers').del()
    .then(function () {
      // Inserts seed entries
      return knex('triggers').insert([
        {id: 1, user_id: 1, custom_deadline: 30},
        {id: 2, user_id: 2, custom_deadline: 20},
        {id: 3, user_id: 3, custom_deadline: 7}
      ]);
    });
};
