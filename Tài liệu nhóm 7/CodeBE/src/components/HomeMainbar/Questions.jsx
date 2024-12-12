import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import axiosClient from "../../api/axiosClient";
import "./Question.css";
import ReactHtmlParser from "html-react-parser"; 

const Question = ({ question }) => {
    const [answers, setAnswers] = useState([]);
    const dispatch = useDispatch();

    // Sử dụng useSelector để lấy userId và username từ Redux store
    const userId = useSelector((state) => state.user.userId);
    const username = useSelector((state) => state.user.username);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const response = await axiosClient.get(`/answers/getAnswersByQuestion?questionId=${question._id}`);
                setAnswers(response.data.result.data);
            } catch (error) {
                console.error("Error fetching answers:", error);
            }
        };

        fetchAnswers();
    }, [question._id]);

    return (
        <div className="display-question-container">
            <div className="display-votes-ans">
                <p>{question.upVote.length} votes</p>
                <p>{question.downVote.length} downvote</p>
                <p>{answers.length} answers</p>
            </div>
            <div className="display-question-details">
                <Link style={{ textDecoration: "none", fontSize: "17px" }} to={`/Questions/${question._id}`}>
                    {question.questionTitle}
                </Link>
                <div className="question-body">
                    <p>{ReactHtmlParser(question.questionBody.substring(0, 150))}...</p>
                    {console.log("Question Body:", question.questionBody)};
                </div>
                <div className="display-tags-time">
                    <div className="display-tags">
                        {question.questionTags.map((tag) => (
                            <p key={tag}>{tag}</p>
                        ))}
                    </div>
                    <p className="display-time">
                        asked {moment(question.askedOn).fromNow()} by {question.userPosted.charAt(0).toUpperCase() + question.userPosted.slice(1)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Question;