import React from 'react';
import { useSelector } from 'react-redux';
const { DateTime } = require('luxon');
import Plot from 'react-plotly.js';

export function BasicMetrics() {
  const userArticles = useSelector((state) => state.userArticles);
  const allTagsList = []
  const readArticles = userArticles.filter(
    (article) => article.readAt !== null)

      //tags per article
  const ArticleTagsList = {}
  //provides a list of articles and associated tags
   for (let i = 0; i < userArticles.length; i++) {
   let article = userArticles[i]
      ArticleTagsList[article.articleId] = article.taggings.map((tag) => tag.tag.name)
      }

  //Coordinated of tags, per tag, per day
  for (const [key, value] of Object.entries(ArticleTagsList)) {
    for (const tag of value) {
      if (!allTagsList.includes(tag))
          allTagsList.push(tag)
    }}

  return (
  <div id="content-sub-header" >
    <strong><i>
      <span class="highlight">{userArticles.length}</span> saved articles, using <span class="highlight">{allTagsList.length}</span>  different tags.
      </i></strong>
  </div>
  )}
