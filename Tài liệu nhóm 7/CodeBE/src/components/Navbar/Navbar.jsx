import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../actions/currentUser";
import logo from "../../ass/logo2.png";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import searchIcon from "../../ass/searchicon.svg";
import Avatar from "../Avatar/Avatar";
import "./Navbar.css";

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");


    if (token) {
      dispatch(setCurrentUser({ token }));
    } else {
      dispatch(setCurrentUser(null));
    }
  }, [dispatch]);



  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/Auth");
    dispatch(setCurrentUser(null));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      navigate(`/Search?query=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        <Link to="/" className="nav-item nav-logo">
          <img src={logo} alt="logo" />
        </Link>
        <Link to="/" className="nav-item nav-btn">About</Link>
        <Link to="/" className="nav-item nav-btn">Products</Link>
        <Link to="/" className="nav-item nav-btn">For Teams</Link>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img
            src={searchIcon}
            alt="searchLens"
            width={18}
            className="search-icon"
          />
        </form>

        {currentUser === null ? (
          <Link to="/Auth" className="nav-item nav-links">Log In</Link>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link
                to={`/Users/${localStorage.getItem("userId")}`}
                style={{ color: "white", textDecoration: "none", display: 'flex', alignItems: 'center' }}
                className="avatar-link"
              >
                <Avatar
                  backgroundColor="#009dff"
                  px="10px"
                  py="7px"
                  borderRadius="50%"
                  color="white"
                  style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FontAwesomeIcon icon={faUser} style={{ color: 'white' }} />
                </Avatar>
              </Link>
            </div>
            <button className="nav-item nav-links" onClick={handleLogOut}>LogOut</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;