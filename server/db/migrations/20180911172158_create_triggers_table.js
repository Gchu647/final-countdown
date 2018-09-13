
exports.up = function(knex, Promise) {
  return knex.schema.createTable('triggers', table => {
    table.increments();
    table.integer('user_id').references('users.id').notNullable();
    table.timestamp('countdown'); // countdown = timestamps NOW + default_timer/customer_timer
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('triggers');
};
