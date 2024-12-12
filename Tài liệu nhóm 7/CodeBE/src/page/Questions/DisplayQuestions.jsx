import React from "react";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar"

import RightSidebar from "../../components/RightSidebar/RightSidebar"
import QuesDetailsDisplay from "./QuesDetailsDisplay.jsx"

const displayQuestions = () => {

    return (
        <div className="home-container-1">
           <LeftSidebar />
           <div className="home-container-2">
                <QuesDetailsDisplay />
                <RightSidebar />
           </div>
        </div>
    )
}

export default displayQuestions;
