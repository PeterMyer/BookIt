import React, { useState } from "react";
import { Link } from "react-router-dom";
import TagFilter from "./TagFilter";

const Sidebar = () => {
    return (
        <div>
            <nav>
                <div>
                    <div className="sidebar-tags-selector-div">
                        <h4>Filter Pages</h4>
                    </div>
                    <TagFilter />
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
