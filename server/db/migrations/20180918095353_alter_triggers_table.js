exports.up = function(knex, Promise) {
  return knex.schema.table('triggers', table => {
    table.boolean('active').defaultTo(true);
    table.boolean('pending_notification').defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('triggers', table => {
    table.dropColumn('active');
    table.dropColumn('pending_notification');
  });
};
