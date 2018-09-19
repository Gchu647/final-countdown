exports.seed = function(knex, Promise) {
  let time = new Date();
  time.setSeconds(time.getSeconds() + 10);
  time = time.toUTCString();
  let time2 = new Date();
  time2.setSeconds(time2.getSeconds() + 20);
  time2 = time2.toUTCString();
  let time3 = new Date();
  time3.setSeconds(time3.getSeconds() + 30);
  time3 = time3.toUTCString();
  // Inserts trigger entries
  return knex('triggers').insert([
    { id: 1, user_id: 1, countdown: time },
    { id: 2, user_id: 2, countdown: time2 },
    { id: 3, user_id: 3, countdown: time3 }
  ]);
};
