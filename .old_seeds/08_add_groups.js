exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('groups').insert([
    { id: 1, relationship_id: 1, package_id: 1, owner_id: 1 },
    { id: 2, relationship_id: 2, package_id: 2, owner_id: 1 },
    { id: 3, relationship_id: 3, package_id: 3, owner_id: 1 },
    { id: 4, relationship_id: 1, package_id: 4, owner_id: 2 },
    { id: 5, relationship_id: 2, package_id: 5, owner_id: 2 },
    { id: 6, relationship_id: 3, package_id: 6, owner_id: 2 },
    { id: 7, relationship_id: 1, package_id: 7, owner_id: 3 },
    { id: 8, relationship_id: 2, package_id: 8, owner_id: 3 },
    { id: 9, relationship_id: 3, package_id: 9, owner_id: 3 }
  ]);
};
