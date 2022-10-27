//TAG READ UNREAD PIE CHARTS COMPONENT
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
const { DateTime } = require('luxon');
import Plot from 'react-plotly.js';
import {readArticlesDates, readArticlesTags, allArticlesTags,tagCounter} from './dataVizHelpers'
import { generatedColors } from './GeneratedColors';
import Plotly from "plotly.js-basic-dist-min";

export function TagPlots() {
  const userArticles = useSelector((state) => state.userArticles);
  const tags = useSelector ((state)=>state.tags)
  const data = [];
  const [visibleIndex, setIndex] = useState(0)
  const [revision, incrementRevision] = useState(0)
  const [traceVisibility, setVisibility] = useState(['true','legendonly','legendonly'])

useEffect(()=>{
    Plotly.Plots.resize("plotlyChart");
},[])

  function handleSwitchData(index){
    setVisibility((traceVisibility)=>{
        traceVisibility[visibleIndex] = 'legendonly'
        traceVisibility[index] = 'true'
        return traceVisibility
    })

    // console.log('new trace', traceVisibility)
    incrementRevision(revision + 1)

    setIndex(index)
  }


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

  //-----Build an object of "All Tags" with count per tag ------//
    let AllTags = {}
    AllTags = tags.tags.reduce((AllTags, item)=>{
        let tag = item
        return AllTags[tag]? 
            AllTags[tag]+=1 :
            AllTags[tag] = 1,
            AllTags
        },{})

 //-----Set Up Plotly 'TRACES' for each Pie Chart ------//
    //Build Traces for Read and Unread Article Tags
    //Sets variables that will be used in plotly individual graphs
    const readTagTrace = {
      labels: Object.keys(readTagResult),
      values: Object.values(readTagResult),
      title: 'Read',
      visible: traceVisibility[2],
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
        visible: traceVisibility[1],
        textposition: 'inside',
        textinfo:'none',
        hole: .3,
        type: 'pie',
        domain: {
          row: 0,
          column:0 }}

        const allTrace = {
        labels: Object.keys(AllTags),
        values: Object.values(AllTags),
        title: 'All',
        textposition: 'inside',
        visible: traceVisibility[0],
        textinfo:'none',
        hole: .3,
        type: 'pie',
        domain: {
            row: 0,
            column:0 }}
    
    
    data.push(allTrace)
    data.push(readTagTrace)
    data.push(remainingTagTrace)

  return (
    <div className = "backlog-tag-plot-container" >
        <div align = 'center'>
            <h4>Tag Overview</h4>
            <h5>Divided by Article Read Status</h5>
        </div>
        <button onClick={()=>{handleSwitchData(0)}}>All Tags</button>
        <button onClick={()=>{handleSwitchData(1)}}>Read Tags</button>
        <button onClick={()=>{handleSwitchData(2)}}>Unread Tags</button>

        <Plot
        data={data}
        style = {{width: "90%", height: "90%"}}
        divId="plotlyChart"
        revision={revision}
        useResizeHandler = "true"
        layout = {{
            autosize: true,
            margin: {
              autoexpand: true,
              l: 0,
              r: 0,
              b: 50,
              t:0,
              pad: 0,
            },
            showlegend: true,
            legend:{
                orientation: 'v',
                y:0.5,
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
