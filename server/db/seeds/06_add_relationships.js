exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('relationships').insert([
    { id: 1, name: 'family', rank: 1 },
    { id: 2, name: 'friends', rank: 2 },
    { id: 3, name: 'haters', rank: 3 }
  ]);
};
