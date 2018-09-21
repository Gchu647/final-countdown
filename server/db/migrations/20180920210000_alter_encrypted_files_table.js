exports.up = function(knex, Promise) {
  return knex.schema.alterTable('encrypted_files', table => {
    table
      .integer('package_id')
      .nullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('encrypted_files', table => {
    table
      .integer('package_id')
      .notNullable()
      .alter();
  });
};
