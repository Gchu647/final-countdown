
exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('packages').insert([
    {id: 1, package_maker_id: 1, recipient_id: 1},
    {id: 2, package_maker_id: 1, recipient_id: 2},
    {id: 3, package_maker_id: 1, recipient_id: 3},
  ]);
};
