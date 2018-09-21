exports.up = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table.dropColumn('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table
      .string('email')
      .unique()
      .notNullable();
  });
};
