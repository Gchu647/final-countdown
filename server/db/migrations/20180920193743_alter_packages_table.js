exports.up = function(knex, Promise) {
  return knex.schema.table('packages', table => {
    table
      .integer('file_id')
      .references('encrypted_files.id')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('packages', table => {
    table.dropColumn('file_id');
  });
};
