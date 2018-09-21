exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('recipients').insert([
    {
      id: 1,
      email: 'joewatt@mailinator.com',
      f_name: 'Joe',
      l_name: 'Watt',
      sender_id: 1,
      group_id: 1
    },
    {
      id: 2,
      email: 'tara@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Tara',
      l_name: 'Bishop',
      sender_id: 1,
      group_id: 2
    },
    {
      id: 3,
      email: 'marawatt@mailinator.com',
      f_name: 'Mara',
      l_name: 'Watt',
      sender_id: 1,
      group_id: 3
    },
    {
      id: 4,
      email: 'daniel@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Daniel',
      l_name: 'Kirk',
      sender_id: 2,
      group_id: 4
    },
    {
      id: 5,
      email: 'silas@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Silas',
      l_name: 'Fry',
      sender_id: 2,
      group_id: 5
    },
    {
      id: 6,
      email: 'jordyn@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Jordyn',
      l_name: 'Greg',
      sender_id: 2,
      group_id: 6
    },
    {
      id: 7,
      email: 'sydney@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Sydney',
      l_name: 'Maxwell',
      sender_id: 3,
      group_id: 7
    },
    {
      id: 8,
      email: 'paloma@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Paloma',
      l_name: 'Geer',
      sender_id: 3,
      group_id: 8
    },
    {
      id: 9,
      email: 'tony@sandboxfb535b41f46842138bd5c25977c3dcfb.mailgun.org',
      f_name: 'Tony',
      l_name: 'Muller',
      sender_id: 3,
      group_id: 9
    }
  ]);
};
