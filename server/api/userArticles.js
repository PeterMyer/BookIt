//ROUTES FOR A SINGLE USERS ARTICLES
const router = require('express').Router();
const {
  models: { UserArticle, Article, Tagging, Tag },
} = require('../db');

module.exports = router;

//Retrieve all articles from UserArticle Table
router.get('/', async (req, res, next) => {
  try {
    const allArticles = await UserArticle.findAll({
      include: [
        {
          model: Article,
          attributes: ['id', 'url', 'author','description','imageURL','logo','publisher','title'],
        },
        {
          model: Tagging,
          include: {
            model: Tag,
          },
        },
      ],
    });
    res.json(allArticles);
  } catch (err) {
    next(err);
  }
});

//Retrieve all of a single user's articles
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userArticles = await UserArticle.findAllByUser(id);
    res.json(userArticles);
  } catch (err) {
    next(err);
  }
});

//Add new article UserArticle Table
router.post('/', async (req, res, next) => {
  try {
    const { name, userId, articleId, featured } = req.body;
    const userArticles = await UserArticle.create({
      name: name,
      userId: userId,
      articleId: articleId,
      featured: featured,
    });
    // console.log("CREATED ARTICLE: ", userArticles);
    res.json(userArticles);
  } catch (err) {
    console.log('CREATE ARTICLE ERR: ', err);
    next(err);
  }
});

// PUT /api/useArticles/:id
router.put('/:id', async (req, res, next) => {
  try {
    //
    const id = req.body.article.id;
    // console.log("_USER ARRTICEL ID > ", id);

    const updateArticle = await UserArticle.update(
      { ...req.body.article },
      {
        where: { id: id },
      }
    );
    // console.log("_ UPDATED USER ARRTICEL > ", updateArticle);
    const updatedUserArticle = await UserArticle.findByPk(id, {
      include: [
        {
          model: Article,
          attributes: ['id', 'url', 'author','description','imageURL','logo','publisher','title'],
        },
        {
          model: Tagging,
          include: {
            model: Tag,
          },
        },
      ],
    });

    res.status(200).json(updatedUserArticle);
  } catch (err) {
    console.log('> PUT /api/useArticles/ID ERR: ', err);
    next(err);
  }
});

// DELETE /api/useArticles/:id
router.delete('/:id', async (req, res, next) => {
  try {
    // console.log("PRODUCT TO DELETE ID > ", req.params.id);
    // console.log("PRODUCT TO DELETE BODY > ", req.body);

    const { id } = req.params;
    const userArticle = await UserArticle.findByPk(id, {
      include: [
        {
          model: Article,
          attributes: ['id', 'url', 'author','description','imageURL','logo','publisher','title'],
        },
        {
          model: Tagging,
          include: {
            model: Tag,
          },
        },
      ],
    });
    console.log('PRODUCT TO DELETE > ', userArticle);
    await userArticle.destroy();
    res.send(userArticle);
  } catch (err) {
    console.log('ERROR FROM DELETE /USEARTICLES/:ID', err);
    next(err);
  }
});
