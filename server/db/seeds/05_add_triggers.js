
exports.seed = function(knex, Promise) {
    let time = new Date();
    time.setDate(time.getDate()+14);
    time = time.toLocaleString();
    console.log('time: ', time);

    // Inserts trigger entries
    return knex('triggers').insert([
      {id: 1, user_id: 1, countdown: time},
      {id: 2, user_id: 2, countdown: time},
      {id: 3, user_id: 3, countdown: time},
    ]);
};

// how do i add in timestamps now + more?
