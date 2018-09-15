
exports.seed = function(knex, Promise) {
  // Inserts encrypted_files
  return knex('encrypted_files').insert([
    {id: 1, name: 'Last Message1', aws_url: 'YOLO', packages_id: 1},
    {id: 2, name: 'Last Message2', aws_url: 'Good bye bro!', packages_id: 2},
    {id: 3, name: 'Last Message3', aws_url: 'I always hated you', packages_id: 3},
    {id: 4, name: 'Last Message4', aws_url: 'Take care buddy', packages_id: 4},
    {id: 5, name: 'Last Message5', aws_url: 'No money no honey', packages_id: 5},
    {id: 6, name: 'Last Message6', aws_url: 'Avocado, tomato, and beansprouts', packages_id: 6},
  ]);
};
