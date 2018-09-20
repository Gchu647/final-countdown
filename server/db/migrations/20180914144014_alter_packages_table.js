// migration breaks in this file
exports.up = function(knex, Promise) {
  return knex.schema.table('packages', table => {
    table.dropColumn('recipient_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('packages', table => {
    table
      .integer('recipient_id')
      .references('recipients.id')
      .notNullable();
  });
};
