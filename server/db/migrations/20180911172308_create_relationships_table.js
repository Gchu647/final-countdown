
exports.up = function(knex, Promise) {
  return knex.schema.createTable('relationships', table => {
    table.increments();
    table.string('name').notNullable();
    table.integer('rank').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('relationships');
};
