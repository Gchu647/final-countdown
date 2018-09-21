exports.up = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table.string('email').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table.dropColumn('email');
  });
};
