
exports.seed = function(knex, Promise) {
  // Remove recipients entries
  return knex('encrypted_files').del()
    .then(function() { // Remove package entries
      return knex('packages').del()
    })
    .then(function() { // Remove recipient entries
      return knex('recipients').del()
    })
    .then(function() { // Remove relationship entries
      return knex('relationships').del()
    })
    .then(function() { // Remove trigger entries
      return knex('triggers').del()
    })
    .then(function() { // Remove all user entries
      return knex('users').del()
    });
};
