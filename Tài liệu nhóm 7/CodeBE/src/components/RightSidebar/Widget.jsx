import React from "react";
import './RightSidebar.css'
import comment from "../../ass/message-solid.svg"
import pen from "../../ass/pen-solid.svg"
import blackLogo from "../../ass/stack-overflow.png"

const Widget = () => {
    return (
        <div className="widget">

            {/* -----------------Blog section----------------------- */}

            <h4>The Overflow Blog</h4>
            <div className="right-sidebar-div-1">
                <div className="right-sidebar-div-2">
                    <img src={pen} className="rightSide-icon" alt="pen" width='14' />
                    <p>Ops teams are pets, not cattle (Ep. 562)</p>
                </div>
                <div className="right-sidebar-div-2">
                    <img src={pen} className="rightSide-icon" alt="pen" width='14' />
                    <p>When setting up monitoring, less data is better (Ep. 563)Featured </p>
                </div>
            </div>

            {/* ---------------------------META Section------------------ */}

            <h4>Featured on Meta</h4>
            <div className="right-sidebar-div-1">
                <div className="right-sidebar-div-2">
                    <img src={comment} className="rightSide-icon" alt="comment" width='14' />
                    <p>Improving the copy in the close modal and post notices - 2023 edition</p>
                </div>
                <div className="right-sidebar-div-2">
                    <img src={comment} className="rightSide-icon" alt="comment" width='14' />
                    <p>New blog post from our CEO Prashanth: Community is the future of AI</p>
                </div>
                <div className="right-sidebar-div-2">
                    <img src={blackLogo} className="rightSide-icon" alt="blackLogo" width='18' />
                    <p>Temporary policy: ChatGPT is banned</p>
                </div>
                <div className="right-sidebar-div-2">
                    <img src={blackLogo} className="rightSide-icon" alt="blackLogo" width='18' />
                    <p>The [protection] tag is being burninated</p>
                </div>
            </div>
        </div>
    )
}

export default Widget;