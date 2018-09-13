// id, f_name, l_name, email, phone_num
exports.up = function(knex, Promise) {
  return knex.schema.createTable('recipients', table => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('f_name').notNullable();
    table.string('l_name').notNullable();
    table.string('phone_num');
    table.integer('sender_id').references('users.id').notNullable();
    table.integer('relationship_id').references('relationships.id').notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('recipients');
};
