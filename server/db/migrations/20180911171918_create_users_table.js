
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('f_name').notNullable();
    table.string('l_name').notNullable();
    table.string('dob');
    table.integer('country').references('countries.id');
    table.integer('state').references('states.id');
    table.string('city');
    table.string('phone_num');
    table.integer('default_countdown').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
