
exports.up = function(knex, Promise) {
  return knex.schema.createTable('encrypted_files', table => {
    table.increments();
    table.string('name').notNullable();
    table.string('aws_url').notNullable();
    table.integer('package_id').references('packages.id').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('encrypted_files');
};
