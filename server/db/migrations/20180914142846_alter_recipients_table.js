exports.up = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table.dropColumn('relationship_id');
    table.integer('group_id').references('groups.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('recipients', table => {
    table
      .integer('relationship_id')
      .references('relationships.id')
      .notNullable();
    table.dropColumn('group_id');
  });
};
