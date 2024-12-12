import React, { useEffect, useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import moment from "moment";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { faCake, faUserPen, faUser } from "@fortawesome/free-solid-svg-icons";
import "./UserProfile.css";
import MyEditor from "../../components/MyEditor/MyEditor";
import { updateUserProfile } from "../../actions/users"; // Import hàm updateUserProfile
import { useDispatch } from "react-redux";
import ReactHtmlParser from "html-react-parser"; 

const UserProfile = () => {
  const { id } = useParams();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // Mặc định là tab profile
  const dispatch = useDispatch();
  // Form Edit here
  const [aboutmeBody, setAboutMeBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosClient.get(`/users/getOne/${id}`);
        setCurrentProfile(response.data.result);
        setDisplayName(response.data.result.username || "");
        setLocation(response.data.result.location || "");
        setTitle(response.data.result.title || "");
        setAboutMeBody(response.data.result.aboutMe || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user", error);
        setError(error);
        setLoading(false);
      }
      
    };

    fetchUserData();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  

  const userId = localStorage.getItem("userId");
  const isCurrentUser = currentProfile && currentProfile.userId === userId;

  const handleBodyChange = (value) => {
    setAboutMeBody(value);
  };

  const handleSave = async () => {
    const updatedProfile = {
      username: displayName, // Cập nhật username
      location,
      title,
      aboutMe: aboutmeBody, // Truyền vào aboutMe
    };

    try {
      // Gọi hàm updateUserProfile để lưu thông tin
      await dispatch(updateUserProfile(currentProfile.userId, updatedProfile));
      toast.success("Profile updated successfully!");
      // Cập nhật currentProfile với thông tin mới
      setCurrentProfile({ ...currentProfile, ...updatedProfile });
      setActiveTab("profile")
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setDisplayName(currentProfile?.username || "");
    setLocation(currentProfile?.location || "");
    setAboutMeBody(currentProfile?.aboutMe || ""); // Khôi phục description
    setTitle(currentProfile?.slogan || ""); // Khôi phục slogan
    setActiveTab("profile");
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <section className="head-userprofile">
          <div style={{ display: "flex"}}>
            {/* <img
              src="/anhuser.jpg"
              alt="Avatar"
              style={{ width: "10%", marginRight: "20px" }}
            /> */}
<FontAwesomeIcon 
  icon={faUser} 
  style={{ 
    marginRight: "10px", 
    fontSize: "24px", // Adjust the size as needed
    border: "2px solid black", // Add a border
    borderRadius: "50%", // Optional: make the border circular
    padding: "5px" // Optional: add some padding
  }} 
/>
            <div style={{ flexDirection: "column" }}>
              <p className="head-name">{currentProfile?.username}</p>
              <p style={{ opacity: 0.5 }}>
                <FontAwesomeIcon icon={faCake} style={{ marginRight: "5px" }} />
                Member for {moment(currentProfile?.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </section>
        {/* Tab Navigation */}
        <div className="tab-navigation">
          {isCurrentUser && (
            <button
              className={`tab-button ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <FontAwesomeIcon
                icon={faUserPen}
                style={{ marginRight: "5px" }}
              />
              Edit My Profile
            </button>
          )}
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Interesting Posts
          </button>
        </div>
        {/* Tab Content */}
        <div className="tab-content">
          {/* Profile của User đang muốn chỉnh sửa */}
          {activeTab === "profile" && (
            <div className="profile-page">
              <div className="sidebar">
                <div className="stats">
                  <h3>Stats</h3>
                  <div className="stat-item">
                    <span>1</span>
                    <p>reputation</p>
                  </div>
                  <div className="stat-item">
                    <span>0</span>
                    <p>reached</p>
                  </div>
                  <div className="stat-item">
                    <span>0</span>
                    <p>answers</p>
                  </div>
                  <div className="stat-item">
                    <span>0</span>
                    <p>questions</p>
                  </div>
                </div>

                <div className="communities">
                  <h3>Communities</h3>
                  <div className="community-item">
                    <p>Stack Overflow</p>
                    <span>1</span>
                  </div>
                  <a href="#" className="edit-link">
                    Edit
                  </a>
                </div>
              </div>

              <div className="main-content">
                <div className="section about">
                  <h3>About</h3>
                  {currentProfile? (
                    <p>{ReactHtmlParser(currentProfile.aboutMe || "")}</p>
                  ) : (
                    <p>Your about me section is currently blank. Would you like to add one? <a href="#" onClick={() => setActiveTab("edit")}>Edit profile</a></p>
                  )}
                </div>

                <div className="section badges">
                  <h3>Badges</h3>
                  <p>
                    You have not earned any <a href="#">badges</a>.
                  </p>
                </div>

                <div className="section posts">
                  <h3>Posts</h3>
                  <div className="post-placeholder">
                    <img src="placeholder-image.png" alt="Posts placeholder" />
                    <p>Just getting started? Try answering a question!</p>
                    <p>
                      Your most helpful questions, answers, and tags will appear
                      here. Start by <a href="#">answering a question</a> or{" "}
                      <a href="#">selecting tags</a> that match topics you’re
                      interested in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCurrentUser && activeTab === "edit" && (
            <div className="info-container">
              <div className="edit-profile">
                <h2>Edit your profile</h2>
                <h3>Public information</h3>
                <div className="profile-container">
                  <div className="profile-image-section">
                    <div className="profile-image">
                      <img src="/anhuser.jpg" alt="Profile" />
                    </div>
                    <button className="change-picture-button">
                      Change picture
                    </button>
                  </div>
                  <div className="profile-info">
                    <label>
                      Display name
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </label>
                    <label>
                      Location
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                      />
                    </label>
                    <label>
                      Title
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="No title has been set"
                      />
                    </label>
                    <label>
                      About me
                      <MyEditor
                        value={aboutmeBody}
                        onChange={handleBodyChange}
                        placeholder=""
                      />
                    </label>
                    <div className="button-group">
                      <button className="save-button" onClick={handleSave}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCurrentUser && activeTab === "posts" && (
            <div className="info-container">
              <h2>Interesting Posts for You</h2>
              <p>Based on your viewing history and watched tags.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
