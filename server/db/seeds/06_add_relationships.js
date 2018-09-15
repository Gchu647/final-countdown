exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('relationships').insert([
    { id: 1, name: 'family', rank: 1 },
    { id: 2, name: 'friend', rank: 2 },
    { id: 3, name: 'hater', rank: 3 }
  ]);
};
