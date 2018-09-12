
exports.up = function(knex, Promise) {
  return knex.schema.createTable('triggers', table => {
    table.increments();
    table.integer('user_id').references('users.id').notNullable();
    table.integer('custom_countdown');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('triggers');
};
