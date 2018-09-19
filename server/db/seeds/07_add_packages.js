exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('packages').insert([
    { id: 1, package_maker_id: 1 },
    { id: 2, package_maker_id: 1 },
    { id: 3, package_maker_id: 1 },
    { id: 4, package_maker_id: 2 },
    { id: 5, package_maker_id: 2 },
    { id: 6, package_maker_id: 2 },
    { id: 7, package_maker_id: 3 },
    { id: 8, package_maker_id: 3 },
    { id: 9, package_maker_id: 3 },
    { id: 10, package_maker_id: 1 },
    { id: 11, package_maker_id: 1 },
    { id: 12, package_maker_id: 1 }
  ]);
};
