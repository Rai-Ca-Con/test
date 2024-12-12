import React from 'react'
import './Menu.css';
import { Link } from 'react-router-dom'

export default function Menu() {

    return (
     
      <ul className="ul">
        <li className="li">
          <Link to="/home" className="button">
            <p className="p">Home</p>
          </Link>
        </li>
        <li className="li">
          <Link to="/login" className="button">
            <p className="p">Login</p>
          </Link>
        </li>
        <li className="li">
          <Link to="/signup" className="button">
            <p className="p">Signup</p>
          </Link>
        </li>
      </ul>
      );
}
