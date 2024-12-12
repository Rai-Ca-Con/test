import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { fetchAnswersByQuestionId } from "../../actions/answers"; // Đảm bảo đường dẫn đúng
import ReactHtmlParser from "html-react-parser"; 

const QuestionItem = ({ question }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const getAnswers = async () => {
      try {
        const fetchedAnswers = await fetchAnswersByQuestionId(
          question.questionId
        );
        setAnswers(fetchedAnswers);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    getAnswers();
  }, [question.questionId]);

  return (
    <div className="display-question-container">
      <div className="display-votes-ans">
        <p style={{ fontWeight: question.score !== 0 ? "bold" : "normal" }}>
          {question.score || 0} {question.score === 1  ? "vote" : "votes"}
        </p>
        <p>{question.views?.length || 0} views</p>
        <div>
          <p
            style={{
              color: answers.length >= 1 ? "green" : "black",
              border: answers.length >= 1 ? "1px solid green" : "none",
              padding: answers.length >= 1 ? "5px" : "0",
              borderRadius: answers.length >= 1 ? "5px" : "0",
            }}
          >
            {answers.length === 0
              ? "No answers"
              : `${answers.length} ${
                  answers.length === 1 ? "answer" : "answers"
                }`}{" "}
          </p>{" "}
        </div>
      </div>
      <div className="display-question-details">
        <Link
          style={{ textDecoration: "none", fontSize: "17px" }}
          to={`/Questions/${question.questionId}`}
        >
          {question.title}
        </Link>
        <div className="question-body">
          <p>{ReactHtmlParser(question.body.substring(0, 150))}...</p>
        </div>
        <div className="display-tags-time">
          <div className="display-tags">
            {question.tags.map((tag) => (
              <p key={tag.tagId}>{tag.name}</p>
            ))}
          </div>
          <p className="display-time">
            asked {moment(question.createdAt).fromNow()} by {question.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;