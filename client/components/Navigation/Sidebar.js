import React, { useState } from "react";
import { Link } from "react-router-dom";
import TagFilter from "./TagFilter";

const Sidebar = () => {
    const [filterOpen, setFilterOpen] = useState(false)

    function openFilter() {
        document.getElementById("mySidebar").style.width = "300px";
        document.getElementById("mySidebar").style.overflow = "visible";
        document.getElementById("main").style.marginLeft = "300px";
        setFilterOpen(true)
    }
      
    function closeFilter() {
        document.getElementById("mySidebar").style.overflow = "hidden";
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        setFilterOpen(false)

    } 

    return (
        <>
        <div className = "outerContainer">
        <div id="mySidebar" className="sidebar">
                <h4 className = "sidebar-header" >Filter Articles</h4>
                <TagFilter />
        </div>
        <div id="main">
            {
            filterOpen?
                <button class="openbtn" onClick={()=>closeFilter()}><i class="fa-solid fa-filter-circle-xmark"></i></button>:
                <button class="openbtn" onClick={()=>openFilter()}><i class="fa-solid fa-filter"></i></button>
            }
        </div>
        </div>
        </>
    );
};

export default Sidebar;
