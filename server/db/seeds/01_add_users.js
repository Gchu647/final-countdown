
exports.seed = function(knex, Promise) {
  // Remove recipients entries
  return knex('recipients').del()
    .then(function() { // Remove trigger entries
      knex('triggers').del()
    })
    .then(function() { // Remove all user entries
      knex('users').del()
    })
    .then(function() { // Insert users entries
      knex('users').insert([
        {id: 1, email:'user1@gmail.com', password:'password', f_name:'Steve', l_name:'Jobs', default_countdown: 14},
        {id: 2, email:'user2@gmail.com', password:'password', f_name:'Abraham', l_name:'Lincoln', default_countdown: 14},
        {id: 3, email:'user3@gmail.com', password:'password', f_name:'Mahatama', l_name:'Gandhi', default_countdown: 14},
      ]);
    })
};
