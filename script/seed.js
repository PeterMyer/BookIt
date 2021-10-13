'use strict';

const {
  db,
  models: { User, Article, Tagging, UserArticle, Tag },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */

const users = [
  { username: 'cody', password: '123', email: 'cody@email.com' },
  { username: 'murphy', password: '123', email: 'murphy@email.com' },
];

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const usersSeedResult = await Promise.all(
    users.map((user) => {
      return User.create(user);
    })
  );

  // Creating Articles
  const articles = await Promise.all([
    Article.create({
      url: 'https://www.reuters.com/world/americas/exclusive-major-coffee-buyers-face-losses-colombia-farmers-fail-deliver-2021-10-11/',
    }),
    Article.create({
      url: 'https://www.vox.com/22709339/james-bond-no-time-die-review-daniel-craig',
    }),
  ]);

  //Creating UserArticles

  const userArticles = [
    {
      featured: false,
      name: 'Google',
      userId: usersSeedResult[0].id,
      articleId: 1,
      readAt: null,
    },
    {
      featured: false,
      name: 'Wikipedia',
      userId: usersSeedResult[1].id,
      articleId: 1,
      readAt: null,
    },
  ];

  const userArticleSeedResult = await Promise.all(
    userArticles.map((userArticle) => {
      return UserArticle.create(userArticle);
    })
  );

  //Create Tags
  const tags = await Promise.all([
    Tag.create({ name: 'news' }),
    Tag.create({ name: 'notNews' }),
  ]);

  // Creating Taggings
  const taggings = [
    { featured: true, userArticlesId: userArticleSeedResult[0].id, tagId: 1 },
    { featured: false, userArticlesId: userArticleSeedResult[0].id, tagId: 2 },
  ];

  await Promise.all(
    taggings.map((tagging) => {
      return Tagging.create(tagging);
    })
  );

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${articles.length} articles`);
  console.log(`seeded ${userArticles.length} userArticles`);
  console.log(`seeded ${tags.length} tags`);
  console.log(`seeded successfully`);

  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
