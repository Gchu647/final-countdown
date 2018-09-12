
exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('recipients').insert([
    {id: 1, email: 'joe@example.com', f_name:'Joe', l_name:'Watt', sender_id: 1, relationship_id: 1},
    {id: 2, email: 'tara@example.com', f_name:'Tara', l_name:'Bishop', sender_id: 1, relationship_id: 2},
    {id: 3, email: 'mara@example.com', f_name:'Mara', l_name:'Watt', sender_id: 1, relationship_id: 3},
    {id: 4, email: 'daniel@example.com', f_name:'Daniel', l_name:'Kirk', sender_id: 2, relationship_id: 1},
    {id: 5, email: 'silas@example.com', f_name:'Silas', l_name:'Fry', sender_id: 2, relationship_id: 2},
    {id: 6, email: 'jordyn@example.com', f_name:'Jordyn', l_name:'Greg', sender_id: 2, relationship_id: 3},
    {id: 7, email: 'sydney@example.com', f_name:'Sydney', l_name:'Maxwell', sender_id: 3, relationship_id: 1},
    {id: 8, email: 'paloma@example.com', f_name:'Paloma', l_name:'Geer', sender_id: 3, relationship_id: 2},
    {id: 9, email: 'tony@example.com', f_name:'Tony', l_name:'Muller', sender_id: 3, relationship_id: 3},
  ]);
};
