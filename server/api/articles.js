const router = require('express').Router();
const {
  models: { Article, UserArticle, Tag, Tagging },
} = require('../db/index');
const sequelize = require('../db/db');

const getallArticles = async (req, res, next) => {
  try {
    const articles = await Article.findAll();
    res.send(articles);
  } catch (error) {
    next(error);
  }
};

// POST /api/articles - CREATES USER ARTICLE WITH ALL ATTRIBUTES (BOTH FROM WEB AND EXTENSION)
const postArticle = async (req, res, next) => {
  const t = await sequelize.transaction({ autocommit: false });
  try {
    let url = req.body.article.url;
    let articleName = req.body.article.name;
    let articleNote = req.body.article.note;
    let isPrivate = req.body.article.isPrivate;
    let userId = req.body.userId;
    let tagsArr = req.body.article.tags;

    //GET METADATA
    const metaData = await Article.prototype.metaData(url)
    const {
      author = null,
      description = null,
      image = null,
      logo = null,
      publisher = null,
      title = null} = metaData

    // CREATE ARTICLE
    const [article, ifCreated] = await Article.findOrCreate({
      where: { 
        url: url,
        author: author,
        description: description,
        imageURL: image,
        logo: logo,
        publisher: publisher,
        title: title
       },
      transaction: t,
    });

    // CREATE USER ARTICLE
    const userArticle = await UserArticle.create(
      {
        name: articleName,
        userId: userId,
        articleId: article.id,
        isPrivate: isPrivate,
        note: articleNote,
      },
      { transaction: t }
    );

    // CREATE TAGS/TAGGING
    await Promise.all(
      tagsArr.map(async (tagName) => {
        let [tag, created] = await Tag.findOrCreate({
          where: { name: tagName },
          transaction: t,
        });

        return await Tagging.create(
          {
            tagId: tag.id,
            userArticlesId: userArticle.id,
          },
          { transaction: t }
        );
      })
    );

    await t.commit();

    const createdArticle = await UserArticle.findByPk( 
      userArticle.id,
      {
        include: [
          {
            model: Article,
            attributes: ['id', 'url', 'author','description','imageURL','logo','publisher','title'],
          },
          {
            model: Tagging,
            include:
              {
              model: Tag,
            },
          },
        ],
      }
    );

    res.status(201).send(createdArticle);
  } catch (error) {
    console.log('CREATE ARTICLE ERR: ', error);
    await t.rollback();
    next(error);
  }
};

// PUT /api/articles - UPDATES USER ARTICLE (ALL ATTRIBUTES, FROM EDIT BOOKMARK COMPONENT)
const changeArticle = async (req, res, next) => {
  const t = await sequelize.transaction({ autocommit: false });
  try {
    const id = req.body.article.id;
    //UPDATE NAME, NOTE AND READAT FIELDS
    if (req.body.article.readAt != '') {
      const updatedArticle = await UserArticle.update(
        {
          name: req.body.article.name,
          note: req.body.article.note,
          readAt: req.body.article.readAt,
        },
        {
          where: { id: id },
          transaction: t,
        }
      );
    } else {
      const updatedArticle = await UserArticle.update(
        {
          name: req.body.article.name,
          note: req.body.article.note,
        },
        {
          where: { id: id },
          transaction: t,
        }
      );
    }

    // CREATE TAGS/TAGGING (FOR ADDED TAGS)

    let addedTags = req.body.article.addedTags;
    await Promise.all(
      addedTags.map(async (tagName) => {
        let [tag, created] = await Tag.findOrCreate({
          where: { name: tagName },
          transaction: t,
        });

        return await Tagging.create(
          {
            tagId: tag.id,
            userArticlesId: id,
          },
          { transaction: t }
        );
      })
    );

    //DELETE TAGGINGS (FOR REMOVED TAGS)
    let removedTags = req.body.article.removedTags;
    await Promise.all(
      removedTags.map(async (tagName) => {
        let tag = await Tag.findOne({
          where: { name: tagName },
          transaction: t,
        });

        await Tagging.destroy({
          where: { tagId: tag.id },
          transaction: t,
        });
      })
    );

    await t.commit();

    const updUserArticle = await UserArticle.findByPk(id, {
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

    res.status(201).send(updUserArticle);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

router.get('/', getallArticles);
router.post('/', postArticle);
router.put('/', changeArticle);

module.exports = router;
