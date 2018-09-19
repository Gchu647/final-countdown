exports.up = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table.integer('package_id').references('packages.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table.dropColumn('package_id');
  });
};
