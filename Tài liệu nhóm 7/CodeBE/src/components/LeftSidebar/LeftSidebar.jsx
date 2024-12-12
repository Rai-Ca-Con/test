import React from "react";
import './LeftSidebar.css';
import { NavLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { FaQuestionCircle } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import globe from "../../ass/globe-solid.svg";

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <nav className="side-nav">
        <NavLink to='/' className='side-nav-links' activeClassName='active'>
          <FaHome style={{ marginRight: "10px", fontSize:"18px" }} />
          <p>Home</p>
        </NavLink>
        <div className="side-nav-div">
          <div>
            <p>
              <img src={globe} style={{width:"17px", paddingTop:"3px", marginRight:"10px"}} alt="Globe" />
              PUBLIC
            </p>
          </div>
          <NavLink to='/Questions' className="side-nav-links" activeClassName='active'>
            <FaQuestionCircle style={{ marginRight: "10px", fontSize:"18px" }} />
            <p> Questions </p>
          </NavLink>
          <NavLink
            to='/Tags'
            className="side-nav-links"
            activeClassName='active'
            style={{ paddingLeft:"10px"}}
          >
            <FaTag style={{ marginRight: "10px", fontSize:"18px" }} />
            <p>Tags</p>
          </NavLink>
          <NavLink
            to='/Users'
            className="side-nav-links"
            activeClassName='active'
            style={{ paddingLeft:"10px"}}
          >
            <FaUserAlt style={{ marginRight: "10px", fontSize:"18px" }} />
            <p>Users</p>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default LeftSidebar;
