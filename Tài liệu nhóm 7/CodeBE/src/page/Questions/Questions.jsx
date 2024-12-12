import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from 'react-toastify';
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import "../../App.css";
import 'react-toastify/dist/ReactToastify.css';
import QuestionList from "../../components/HomeMainbar/QuestionList";
import { useSelector } from "react-redux";

const Questions = () => {
    const location = useLocation();
    const user = useSelector((state) => state.currentUser);
        const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);

    // Handle registration toast notification
    useEffect(() => {
        if (location.state?.registered) {
            toast.success("Welcome! Your account has been created successfully.🎉", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axiosClient.get('/questions/getAll');
                if (response && response.data && response.data.result && Array.isArray(response.data.result.data)) {
                    setQuestions(response.data.result.data);
                    console.log("Questions:", response.data.result.data);
                } else {
                    console.error("No questions found");
                    setQuestions([]);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                setQuestions([]);
            }
        };
        fetchQuestions();
    }, []);

    const filteredQuestions = questions.filter(question => {
        if (question.answers && question.answers.length > 0) {
            return !question.answers.some(answer => answer.upvotes > 0 || answer.isAccepted);
        }
        return true;
    });

    const redirect = () => {
        if (user === null) {
            navigate("/Auth");
        } else {
            navigate("/AskQuestion");
        }
    };

    return (
        <div className="home-container-1">
            <LeftSidebar />
            <div className="home-container-2">
                <div className="main-bar">
                    <div className="main-bar-header">
                        {location.pathname === '/' ? <h1>Top Questions</h1> : <h1>Questions</h1>}
                        <button className="ask-btn-1" onClick={redirect}>Ask Question</button>
                    </div>
                    <div>
                        {questions.length === 0 ? <h1>Loading...</h1> : (
                            <>
                                <div className="main-bar-header2">
                                    <div>
                                        <p>{filteredQuestions.length} questions with no <br />upvoted or accepted answers</p>
                                    </div>
                                    <div className="mainbar-header-buttons">
                                        <Link to="/New"><button className="ask-btn-2">New</button></Link>
                                        <Link to="/Active"><button className="ask-btn-2">Active</button></Link>
                                        <Link to="/Bountied"><button className="ask-btn-2">Bountied</button></Link>
                                        <Link to="/Unanswered"><button className="ask-btn-2">Unanswered</button></Link>
                                        <button className="ask-btn-2">More</button>
                                        <button className="ask-btn-2 filter">Filter</button>
                                    </div>
                                </div>
                                <hr style={{ width: "100%", marginLeft: "0" }} />
                                <QuestionList questionsList={filteredQuestions} />
                            </>
                        )}
                    </div>
                </div>
                <RightSidebar />
            </div>
        </div>
    );
};

export default Questions;