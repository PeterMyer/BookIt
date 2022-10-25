//Articles DB
const Sequelize = require('sequelize');
const db = require('../db');

//generateopen graph data
const metascraper = require('metascraper')([
  require('metascraper-author'),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
]);
const got = require('got');

//Articles must be unique, not empty or null, and must be URL
const Article = db.define('article', {
  url: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true,
      notEmpty: true,
      notNull: true,
    },
  },
  author: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  imageURL:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  logo:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  publisher:{ 
    type: Sequelize.STRING,
    allowNull:true},
  title: {
    type: Sequelize.STRING,
    allowNull:true
  }
});

module.exports = Article;

//METHODS
//Instance Methods
//Get open graph data
Article.prototype.metaData = async function (targetUrl) {
  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });
  return metadata;
};
