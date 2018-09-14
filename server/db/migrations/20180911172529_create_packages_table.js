
exports.up = function(knex, Promise) {
  return knex.schema.createTable('packages', table => {
    table.increments();
    table.integer('package_maker_id').references('users.id').notNullable();
    table.integer('recipient_id').references('recipients.id').notNullable();
    table.string('access_url');
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('packages');
};
