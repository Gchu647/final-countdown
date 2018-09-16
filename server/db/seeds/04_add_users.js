exports.seed = function(knex, Promise) {
  // Insert users entries
  // Timer is seconds.  604800 seconds is 7 days.
  return knex('users').insert([
    {
      id: 1,
      email: 'user1@example.com',
      password: '$2b$12$k9e9IIZ.G1nDIRmSUjb/yOC5WEoCii1CrtIWanGKJwfRUy/poVlWq',
      f_name: 'Steve',
      l_name: 'Jobs',
      default_timer: 604800
    },
    {
      id: 2,
      email: 'user2@example.com',
      password: '$2b$12$BSeLwzMj1MsNxQHKISC6ued0tILO5WyoMiRvjSmBTygKJaf9fteQC',
      f_name: 'Abraham',
      l_name: 'Lincoln',
      default_timer: 604800
    },
    {
      id: 3,
      email: 'user3@example.com',
      password: '$2b$12$s8zkkBlEABIT2iouaINqbevNM4nzNd81GD1Wqf7tg4zFwbfXcC3fC',
      f_name: 'Mahatama',
      l_name: 'Gandhi',
      default_timer: 604800
    }
  ]);
};
