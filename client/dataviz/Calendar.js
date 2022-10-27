import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
const { DateTime } = require('luxon');
import Plot from 'react-plotly.js';
import {readArticlesDates} from './dataVizHelpers'
import Plotly from "plotly.js-basic-dist-min";


export function Calendar() {
  const userArticles = useSelector((state) => state.userArticles);
  const zdata = [];
  let [readArtcilesOnDate, setReadArticles] = useState([])
  let [selectedDate, setselectedDate] = useState(null)

  function handleClick(data){
    let seperatedDate = data.points[0].text.split(" ")
    let cleanedDate = seperatedDate[0].trim()
      setselectedDate(cleanedDate)
    let selectedArtciles = sortedArticles[cleanedDate]
    setReadArticles(selectedArtciles)
  }

  useEffect(()=>{
    Plotly.Plots.resize("plotlyChart");
  },[])

  //Get individual read articles organized by date read
  //Using a helper function shared between the different dataviz oomponents
  const sortedArticles = readArticlesDates(userArticles)

  //----BUILD CALENDAR HEAT MAP------//
  //Get current date and year
  const today = new Date();
  let curentYear = today.getFullYear();

  //set Start and end dates of Calendar
  const startDate = new Date();
  startDate.setFullYear(curentYear, 0, 1);
  const endDate = new Date();
  endDate.setFullYear(curentYear, 11, 31);

  //set month names and date ranges to help build xAxis
  const month_names = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
  ];
  const month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //getDates() builds list of dates between start and end
  ///For loop takes "start date" and 'end date',
  ///while date not greater than end date
  ///push date to 'DateArray' and then iterate to next date
  function getDates(startDate, endDate) {
    let dateArray = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dateArray.push(new Date(date).toISOString());
    }
    return dateArray;
  }

  //Use above 'getDates()' to build a list of calendar dates
  /// For each date in calendar build a list of equal length for matching weekday
  /// and 'weekNumber' 1-52. If weekNumber >52 it is 'extra' days from last
  /// calendar year. Assign to start of calendar 'weekNumber = 0'
  let calendarDates = getDates(startDate, endDate);
  let weekDaysinYear = calendarDates.map((day) => DateTime.fromISO(day).weekday);
  let weekNumber = calendarDates.map((day) =>{
    let number = DateTime.fromISO(day).weekNumber
    if(number>52){
      number = 0}
    return number});
  const text = calendarDates.map((day) => DateTime.fromISO(day).toFormat(
    'yyyy-MM-dd'
  ))

  //-----BUILD ZDATA TO BE GRAPHED ON CALENDAR------//
  // Start with an if clause to prevent running below code before article data
  ///has been retrieved. Loop through calendar dates and check against article
  //read dates in 'sortedArticles'. If found push length zdata to represent # of
  //read articles. If nothing found for that push 0 to zdata.

  if (Object.keys(sortedArticles).length > 0) {
    perday: for (let i = 0; i <= calendarDates.length; i++) {
      let calendarDate = DateTime.fromISO(calendarDates[i]).toFormat(
        'yyyy-MM-dd'
      );
      const keyDates = Object.keys(sortedArticles);
      for (let j = 0; j < keyDates.length; j++) {
        if (calendarDate === keyDates[j]) {
          zdata.push(sortedArticles[keyDates[j]].length);
          text.splice(i,1,`${calendarDate} <br>Articles Read : ${sortedArticles[keyDates[j]].length}`)

          continue perday;
        }
      }
      zdata.push(0);
    }
  }
  //-----Set Up Plotly 'TRACE' of X, Y, and Z data ------//
  // Trace sets up information about how a particular data set will be displayed
  //including graph type and color scale
  const calendarTrace = [
    {
      x: weekNumber,
      y: weekDaysinYear,
      z: zdata,
      xgap: 3,
      ygap: 3,
      type: 'heatmap',
      showscale: false,
      text:text,
      hoverinfo:'text',
      colorscale: [
        ['0.0', '#CCD1D1'],
        [true, '#2ECC71']]
    },
  ];
  //-----Plot Graph ------//
  //Return <Plot> react-plotly.js object to be displayed on UserMetrics page.
  // Sets overall graph size and display options
  return (
    <div className="tab-content-row">
      <div id="plotly-calendar" className = "user-content-container">
      <strong className = "subcategory-title">Read This Year</strong >
      <Plot
        divId="plotlyCalendar"
        useResizeHandler = "true"

        data={calendarTrace}
        // useResizeHandler={true}
        style={{width: '900px', height: "150px"}}
        config={{displayModeBar: false}}
        onClick={((data)=>handleClick(data))}
        layout={{
          autosize: true,
          margin:{      
            t: 0,
            b: 60
          },

          yaxis: {
            showline: true,
            tickmode: 'array',
            ticktext: ['Mon', 'Wed', 'Fri'],
            tickvals: [1, 3, 5],
          },
          xaxis:{
            showline:false,
            showgrid:false,
            zeroline:false,
            tickmode:'array',
            ticktext:month_names,
            tickvals:[1,5,9,14,18,23,27,31,36,40,44,49]
        }}}
      />
      <div >
        {readArtcilesOnDate ? readArtcilesOnDate.map((article) => {
          return (
            <table className = "calendar-article-list-table">
              <thead><strong>Read {selectedDate} </strong></thead>
              <tbody>
                <tr key={article.id} >
                  <td ><i>{article.name}</i></td>
                  <td><i>{article.article.publisher}</i></td>
                  <td >
                    <a href={article.article.url}>
                    <div>{article.article.title}</div>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          );
        }):null}
      </div>
      </div>
      </div>
  );
}
