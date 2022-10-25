import React from 'react';
import { useSelector } from 'react-redux';
const { DateTime } = require('luxon');
import Plot from 'react-plotly.js';
import {readArticlesDates} from './dataVizHelpers'

export function TimeChart() {
  const userArticles = useSelector((state) => state.userArticles);
  const sortedaddedArticles = {}; //Sorted list of all articles by date added
  const yReadTotal = [];
  const data = [];
  const addedDateList = [];
  let yhelperRead = [];
  let yhelperAdd = [];
  const yTotalArticles = [];

  //Get individual read articles organized by date read
  //Using a helper function shared between the different dataviz oomponents
  const sortedArticles = readArticlesDates(userArticles)

  //Get Articles added by Date
  userArticles.map((article) => {
    addedDateList.push(article.createdAt);
  });
  addedDateList.sort();
  addedDateList.map((date) => {
    sortedaddedArticles[date] = userArticles.filter(
      (article) => article.createdAt === date
    );
  });


  let xReadDates = Object.keys(sortedArticles);
  xReadDates = xReadDates.map(date => DateTime.fromISO(date).toFormat('yyyy-MM-dd'))
  let xAddedDates = Object.keys(sortedaddedArticles);
  xAddedDates = xAddedDates.map(date => DateTime.fromISO(date).toFormat('yyyy-MM-dd'))

  for (const [key, value] of Object.entries(sortedaddedArticles)) {
    yhelperAdd.push(value.length);
  }

  for (let i = 0; i < yhelperAdd.length; i++) {
    if (i === 0) {
      yTotalArticles.push(yhelperAdd[i]);
    } else {
      yTotalArticles.push(yTotalArticles[i - 1] + yhelperAdd[i]);
    }
  }

  yhelperRead = [];
  for (const [key, value] of Object.entries(sortedArticles)) {
    yhelperRead.push(value.length);
  }

  console.log('yread totals', yhelperRead)

  for (let i = 0; i < yhelperRead.length; i++) {
    if (i === 0) {
      yReadTotal.push(yhelperRead[i]);
    } else {
      yReadTotal.push(yReadTotal[i - 1] + yhelperRead[i]);
    }
  }

  //add final date value to update graph to present
  xAddedDates.push(DateTime.utc().toFormat('yyyy-MM-dd'));
  let mostRecentValue = yTotalArticles.at(-1);
  yTotalArticles.push(mostRecentValue);
  console.log('added dates',xAddedDates)

  //TRACE DATA FOR TIMECHART
  const readArticleTrace = {
    x: [xReadDates[0], ...xReadDates,DateTime.utc().toFormat('yyyy-MM-dd')],
    y: [0, ...yReadTotal, yReadTotal.at(-1)],
    name: 'Total Read',
    type: 'scatter',
    mode: 'lines',
    marker: { color: 'blue' },
    fill: 'tozeroy',
    line: { shape: 'spline' },
  };
  const addedArticleTrace = {
    x: xAddedDates,
    y: yTotalArticles,
    name: 'Total Added',
    type: 'scatter',
    mode: 'lines',
    marker: { color: 'red' },
    fill: 'tozeroy',
    line: { shape: 'spline' },
  };

  data.push(readArticleTrace, addedArticleTrace);

  return (
    <div className = "backlog-plot-container">
      <h3>Total Backlog v. Amount Read</h3>
    <Plot
      data={data}
      useResizeHandler={true}
      style={{width: '100%', height: '100%'}}
      layout={{
        margin:{b:0},
        barmode: 'stack',
        xaxis: {
          autorange: true,
          // tickformat: '%B %Y',
          range: [xAddedDates[0], DateTime.utc().toFormat('yyyy-MM-dd')],
          rangeselector: {
            buttons: [
              {
                count: 1,
                label: '1m',
                step: 'month',
                stepmode: 'backward',
              },
              {
                count: 6,
                label: '6m',
                step: 'month',
                stepmode: 'backward',
              },
              { step: 'all' },
            ],
          },
          rangeslider: { range: [xAddedDates[0], DateTime.utc().toISO()] },
          type: 'date',
        },
        yaxis: {
          autorange: true,
          type: 'linear',
        },
      }}
      config={{"responsive": true}}
    />
    </div>
  );
}
