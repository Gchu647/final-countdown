
exports.up = function(knex, Promise) {
  return knex.schema.createTable('groups', table => {
    table.increments();
    table.integer('relationship_id').references('relationships.id');
    table.integer('package_id').references('packages.id');
    table.integer('owner_id').references('users.id');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('groups');
};
