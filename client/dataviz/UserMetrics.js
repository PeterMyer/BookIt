import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar } from './Calendar';
import { Indicator} from './indicator'
import { TagRatio } from './TagReadUnreadRatio';
import { TimeChart } from './TimeChart';
import {TagReadUnread} from './TagReadUnreadRatio'
import { BasicMetrics } from './BasicStats';

export function UserMetrics() {
  return (
    <div >
      <h1 align="center">Here Are Your Latest User Metrics</h1>
      <h2 align="center">Visualize Your Reading Habits</h2>
      <div align="center" >
        <Indicator />
      </div>
      <div align="center" >
        <div className="dataviz-box">
          <h1 className = "dvSectionHeader"> Overview of Your Backlog</h1>
          <BasicMetrics/>
          <div className = "dataviz-row">
            <TimeChart id="backlogChart"/>
            <TagReadUnread id="tagChart"/>
          </div>
        </div>
      </div>
      <div align="center">
        <div className = "dataviz-box">
        <h1 className = "dvSectionHeader"> Reading Activity Over The Last Year</h1>
          <Calendar />
       </div>
      </div>
    </div>
  );
}
