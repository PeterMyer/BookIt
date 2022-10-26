//TAG READ UNREAD PIE CHARTS COMPONENT
import React from 'react';
import { useSelector } from 'react-redux';
const { DateTime } = require('luxon');
import Plot from 'react-plotly.js';
import {readArticlesDates, readArticlesTags, allArticlesTags,tagCounter} from './dataVizHelpers'

export function TagReadUnread() {
  const userArticles = useSelector((state) => state.userArticles);
  const data = [];

  //Get individual read articles organized by date read
  //Using a helper function shared between the different dataviz oomponents
  const sortedArticles = readArticlesDates(userArticles)

  //-------------------Get Tags Total --------------------//
  const allTagsList = [];

  //tags per article
  //provides a list of articles and associated tags
  const ArticleTagsList = allArticlesTags(userArticles)


  //Coordinated of tags, per tag, per day
  for (const [key, value] of Object.entries(ArticleTagsList)) {
    for (const tag of value) {
      allTagsList.push(tag);
    }
  }

  //Build a list of tags and their total count
  //uses allTagsList and ArticleTagsList
  const unreadTagsResult = tagCounter(allTagsList,ArticleTagsList);

    //-------------------Get Tags of Read Articles --------------------//
    const dateTagCount = [];
    const allReadTagsList = [];

    //tags per read article
    const readArticleTagsList = readArticlesTags(userArticles)

    //Build a lists of tags per date and consolidated list all read article tags
    for (const [key, value] of Object.entries(sortedArticles)) {
      const dateTags = [];
      for (const article of value) {
        article.taggings.map(
          (tag) =>
            dateTags.push(tag.tag.name) && allReadTagsList.push(tag.tag.name)
        )}
      dateTagCount[key] = dateTags;
    }

    //Build a list of tags and their total count
    //uses allReadTagsList and readArticleTagsList
     const readTagResult = tagCounter(allReadTagsList,readArticleTagsList)

  //-----Build an object of "Unread Articles" by removing read from total ------//

    //Build "Remaining Tags variable" which will be used for "Unread Article Tags"
    const remainingTagResult = {}
    for (const [key, value] of Object.entries(unreadTagsResult)){
      let totalarticles = unreadTagsResult[key]
      let totalread = readTagResult[key]? readTagResult[key]:0
        remainingTagResult[key] = (totalarticles - totalread)
    }

 //-----Set Up Plotly 'TRACES' for each Pie Chart ------//
    //Build Traces for Read and Unread Article Tags
    //Sets variables that will be used in plotly individual graphs
    const readTagTrace = {
      labels: Object.keys(readTagResult),
      values: Object.values(readTagResult),
      title: 'Read',
      textposition: 'inside',
      textinfo:'none',
      hole: .3,
      type: 'pie',
      domain: {
        row: 0,
        column: 0}}

      const remainingTagTrace = {
        labels: Object.keys(remainingTagResult),
        values: Object.values(remainingTagResult),
        title: 'Unread',
        textposition: 'inside',
        textinfo:'none',
        hole: .3,
        type: 'pie',
        domain: {
          row: 1,
          column:0 }}

    data.push(remainingTagTrace)
    data.push(readTagTrace)


  return (
    <div>
      <div align = 'center'>
    <h4>Tag Overview</h4>
    <h5>Divided by Article Read Status</h5>
    </div>
    <Plot
      data={data}
      useResizeHandler={true}
      style={{width: '100%', height: '100%'}}
      layout = {{
        margin: {
          autoexpand: false,
          l: 0,
          r: 0,
          b: 0,
          t: 0,
          pad: 0,
        },
        showlegend: true,
        legend: {

          xanchor: "left",
          yanchor: "center"
        },
        grid: {rows: 2,
          columns: 1,
          pattern: 'independent',
  }
    }}
      config={{
        "displaylogo": false,
        'modeBarButtonsToRemove': ['pan2d','lasso2d'],
           }}
    />
    </div>
  );
}
