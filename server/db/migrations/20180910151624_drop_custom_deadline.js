
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('triggers', table => {
    table.dropColumn('custom_deadline');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('triggers', table => {
    table.string('custom_deadline');
  });
};
