exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('groups').insert([
    { id: 1, relationship_id: 1, package_id: 7, owner_id: 1 },
    { id: 2, relationship_id: 2, package_id: 8, owner_id: 1 },
    { id: 3, relationship_id: 3, package_id: 9, owner_id: 1 }
  ]);
};
