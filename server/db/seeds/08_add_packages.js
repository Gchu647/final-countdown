
exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('packages').insert([
    {id: 1, package_maker_id: 1, recipient_id: 1, access_url: 'https://medium.com/the-mission/steve-jobs-secret-for-eliciting-questions-overheard-at-a-san-francisco-cafe-80b1af67433'},
    {id: 2, package_maker_id: 1, recipient_id: 2, access_url: 'https://medium.com/business-erin/you-are-not-steve-jobs-9ae1727d2479'},
    {id: 3, package_maker_id: 1, recipient_id: 3, access_url: 'https://medium.com/marketing-and-entrepreneurship/7-things-steve-jobs-said-that-you-should-say-every-single-day-c276fa96238'},
  ]);
};
