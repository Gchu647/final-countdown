
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('relationships').del()
    .then(function () {
      // Inserts seed entries
      return knex('relationships').insert([
        {id: 1, name:'family' ,rank: 1},
        {id: 2, name:'friend' ,rank: 2},
        {id: 3, name:'hater' ,rank: 3},
      ]);
    });
};
