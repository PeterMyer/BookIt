//INDICATOR COMPONENT AND ARTICLES READ THIS WEEK
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
const { DateTime } = require('luxon');
import Plot from 'react-plotly.js';
import {readArticlesDates} from './dataVizHelpers'

export function Indicator() {
  const dispatch = useDispatch();
  const userArticles = useSelector((state) => state.userArticles);
  const metaData = useSelector((state) => state.metaData);
  const articlesThisWk = [];
  const articlesLastWk = [];

  //Get individual read articles organized by date read
  //Using a helper function shared between the different dataviz oomponents
  const sortedArticles = readArticlesDates(userArticles)
  const thisWeekStart = DateTime.now().startOf('week').toISO();
  const lastWeekStart = DateTime.now().startOf('week').minus({ days: 7 }).toISO();

  //----GET COUNT OF ARTICLES READ THIS WEEK------//
    //Luxon converts dates to their own DateTime format, so we revert back to ISO
    ///using .toISO().
    //If date from sorted Article is >= the start of this week add article Obj
    //to articlesThisWeek.
  Object.keys(sortedArticles).map((key) => {
    let keyDate = DateTime.fromISO(key).toISO();
    if (keyDate >= thisWeekStart) {
      articlesThisWk.push(...sortedArticles[key]);
    }
  });

  //----GET COUNT OF ARTICLES READ LAST WEEK------//
  //Luxon converts dates to their own DateTime format, so we revert back to ISO
    ///using .toISO().
    //If date from sorted Article is < the start of this week add article Obj
    //to articlesLastWeek.
  Object.keys(sortedArticles).map((key) => {
    let keyDate = DateTime.fromISO(key).toISO();
    if (keyDate < thisWeekStart && keyDate >= lastWeekStart) {
      articlesLastWk.push(...sortedArticles[key]);
    }
  });

  //-----Set Up Plotly 'TRACE' for Inidicator ------//
  // Trace sets up information about how a particular data set will be displayed
  ///including graph type and color scale. Here we graph total value read and
  /// delta; difference between this week and last
  const indicatorTrace = [
    {
      type: 'indicator',
      title: 'This Week v. Last',
      mode: 'number+delta',
      value: articlesThisWk.length,
      delta: { reference: articlesLastWk.length, position: 'top' },
      domain: { x: [0, 1], y: [0, 1] },
    },
  ];

  //-----DISPLAY ARTICLES READ THIS WEEK ------//
  //Map Metadata to Each Article
  ///We use article Ids to match retrieved meta data with the articles we have
  ///read this week
  useEffect(() => {
    for (let i = 0; i < articlesThisWk.length; i++) {
      for (let j = 0; j < metaData.length; j++)
        if (articlesThisWk[i].id === metaData[j].articleId) {
          articlesThisWk[i]['metadata'] = metaData[j];
        }
    }
  }, [metaData.length]);

  //-----DISPLAY COMPONENT INDICATOR + ARTICLES READ ------//
    //Return <Plot> react-plotly.js object to be displayed on UserMetrics page.
    //A table component is used to display the scrollable list of articles read
    //this week and attached metadata if available. If none available default
    //is displayed
  return (
    <div className="dataviz-box">
      <h4  className="dvSectionHeader">Articles Read This Week</h4>
      <div className="dataviz-row">
        <table className = "weekly-article-list-table">
            <thead></thead>
            <tbody>
              {articlesThisWk.map((article) => {
                return (
                  <tr key={article.id} className="articlerow">
                    <td>{article.name}</td>
                      <td className="articledetails">
                        <a href={article.article.url}>
                            <img
                              src={
                                article.article.logo
                                  ? article.article.logo
                                  : '/defaultBookLogo.svg'
                              }
                              height="40px"
                            /></a>
                        <div>{article.article.title}</div>
                      </td>
                  </tr>
                );
              })}
            </tbody>
        </table>
        <div>
          <Plot
            data={indicatorTrace}
            layout={{
              height: 200,
              width: 200,
              margin: {
                l: 0,
                r: 0,
                b: 5,
                t: 50,
                pad: 0,
              },
            }}
            config={{
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
            }}
          />
        </div>
      </div>
    </div>
  );
}
