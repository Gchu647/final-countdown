exports.seed = function(knex, Promise) {
  // Inserts encrypted_files
  return knex('encrypted_files').insert([
    { id: 1, name: 'Last Message1', aws_url: 'YOLO', package_id: 1 },
    { id: 2, name: 'Last Message2', aws_url: 'Good bye bro!', package_id: 2 },
    {
      id: 3,
      name: 'Last Message3',
      aws_url: 'I always hated you',
      package_id: 3
    },
    { id: 4, name: 'Last Message4', aws_url: 'Take care buddy', package_id: 4 },
    {
      id: 5,
      name: 'Last Message5',
      aws_url: 'No money no honey',
      package_id: 5
    },
    {
      id: 6,
      name: 'Last Message6',
      aws_url: 'Avocado, tomato, and beansprouts',
      package_id: 6
    },
    {
      id: 7,
      name: 'Family Message1',
      aws_url: 'Farewell, family',
      package_id: 7
    },
    {
      id: 8,
      name: 'Friends Message1',
      aws_url: 'Farewell, friends',
      package_id: 8
    },
    {
      id: 9,
      name: 'Haters Message1',
      aws_url: 'Farewell, haters',
      package_id: 9
    }
  ]);
};
