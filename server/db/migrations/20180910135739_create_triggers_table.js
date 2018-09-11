
exports.up = function(knex, Promise) {
  return knex.schema.createTable('triggers', table => {
    table.increments();
    table.integer('user_id').references('users.id').notNullable();
    table.string('custom_deadline');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('triggers');
};
