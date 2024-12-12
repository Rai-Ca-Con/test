import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import "./HomeMainbar.css";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
const HomeMainbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // console.log("Token:", token);
    // console.log("User ID:", userId);

    if (token && userId) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "User");

      axiosClient
        .get(`questions/getQuestionsByUser?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // console.log("API Response:", response.data);
          if (
            response.data &&
            response.data.result &&
            response.data.result.data
          ) {
            setUserQuestions(response.data.result.data); // Access the correct path for user questions
          } else {
            console.warn("Unexpected response structure:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user questions:", error);
          toast.error("Failed to load your questions.");
        });
    } else {
      setIsLoggedIn(false);
    }

    if (location.state?.registered) {
      toast.success("Welcome! Your account has been created successfully.🎉", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  return (
    <div>
      <div className="main-bar">
        {isLoggedIn ? (
          <div>
            <h1>Welcome back, {username}</h1>
            <div>
              <button
                className="ask-button"
                onClick={() => navigate("/AskQuestion")}
              >
                Ask Question
              </button>
              <button
                className="ask-button"
                onClick={() =>
                  navigate(`/UserProfile/${localStorage.getItem("userId")}`)
                }
              >
                <FontAwesomeIcon icon={faUser} style={{ marginRight: "5px" }} />
                View My Profile
              </button>
            </div>
            <div className="info-container">
              <div className="container-item">
                <h2>Your Posted Questions</h2>
                <ul className="user-questions-list">
                  {userQuestions.length > 0 ? (
                    userQuestions.map((question) => (
                      <li key={question.questionId} className="question-item">
                        <a
                          href={`/Questions/${question.questionId}`}
                          className="question-title-link"
                        >
                          {question.title}
                        </a>
                      </li>
                    ))
                  ) : (
                    <p>You haven't posted any questions yet.</p>
                  )}
                  {/* {console.log("User Questions:", userQuestions)} */}
                </ul>
              </div>
              <div className="container-item">
                <h2>Badge Progress</h2>
                <p>Take the tour to earn your first badge!</p>
              </div>
              <div className="container-item">
                <h2>Watched Tags</h2>
                <p>You're not watching any tags yet!</p>
                <p>Customize your content by watching tags.</p>
              </div>
              <div className="container-item">
                <h2>Interesting Posts for You</h2>
                <p>Based on your viewing history and watched tags.</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>Every developer has a tab open to [Your Platform]</h1>
            <p>
              For over X years, we've been the Q&A platform of choice where
              millions of people visit every month to ask questions, learn, and
              share technical knowledge.
            </p>
            <p>Services for companies of all shapes & sizes.</p>
            <button onClick={() => navigate("/Auth")}>Join Us</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeMainbar;
