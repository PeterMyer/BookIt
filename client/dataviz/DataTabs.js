import React, {useEffect} from "react";
import { useSelector } from 'react-redux';
import { ReadingHistory} from './ReadingHistory'
import { Calendar } from './Calendar';
import { BasicMetrics } from './BasicStats';
import { TimeChart } from './TimeChart';
import { UserContent } from "./UserContent";
import {TagPlots} from "./TagPlots"

export function DataTabs(){
    const user = useSelector((state) => state.auth);

    const openTab=(event, tabName)=>{
    // Get all elements with class="tabcontent" and hide them
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    let thisDocument = document.getElementById(tabName)
    thisDocument.style.display = "block";
    event.currentTarget.className += " active";
    }

    useEffect(()=>{
        document.getElementById("defaultOpen").click()
    },[])
    return(
        <article className = "user-metrics-container">
            <div class="tab">
                <button class="tablinks" id="defaultOpen" onClick={()=>openTab(event, "UserContent")}> Content</button>
                <button class="tablinks"  onClick={()=>openTab(event, "ReadingHistory")}>Reading History</button>
                {/* <button class="tablinks" onClick={()=>openTab(event, "Backlog")}>Backlog</button> */}

            </div>
            <section className = "user-metrics-tab-content-container">
                <h1>{user.username}</h1>
                <br></br>

                <div id="UserContent" class="tabcontent">
                    <h2>Your Content</h2>
                    <BasicMetrics/>
                    <hr/>
                    <UserContent/>
                </div>
                <div id="ReadingHistory" class="tabcontent">
                    <h2>Your Reading History</h2>
                    <hr/>
                        <ReadingHistory />
                        <Calendar />
                </div>
                <div id="Backlog" class="tabcontent">
                    <h2>Your Backlog</h2>
                    <hr/>
                        <div id="backlog" className="tab-content-row">
                            <TimeChart id="backlogChart"/>
                            <TagPlots id="tagChart"/>
                        </div>
                </div>
            </section>
        </article>
)}