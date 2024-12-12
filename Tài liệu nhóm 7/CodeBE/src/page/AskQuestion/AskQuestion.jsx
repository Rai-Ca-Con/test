import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyEditor from "../../components/MyEditor/MyEditor";
import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";
import { toast } from "react-toastify";

const AskQuestions = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");
  const [isTitleFilled, setIsTitleFilled] = useState(false);
  const [isBodyFilled, setIsBodyFilled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const User = useSelector((state) => state.currentUser);

  const handleTitleChange = (e) => {
    setQuestionTitle(e.target.value);
    setIsTitleFilled(e.target.value.trim() !== "");
  };

  const handleBodyChange = (value) => {
    setQuestionBody(value);
    setIsBodyFilled(value.trim() !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionTitle || !questionBody || !questionTags) {
      toast.error("Please fill out all fields before submitting your question.");
      return;
    }

    const uniqueTags = [...new Set(questionTags.split(" ").map(tag => tag.trim()).filter(tag => tag))];

    if (User) {
      dispatch(
        askQuestion(
          {
            title: questionTitle,
            body: questionBody,
            tags: uniqueTags.map(tag => ({ name: tag })),
            userPosted: User.username,
            userId: User.userId,
          },
          navigate
        )
      );
    } else {
      toast.error("You must be logged in to post a question.");
    }
  };

  return (
    <div className="ask-questions">
      <div className="ask-ques-container">
        <h1>Ask a public question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <div className="each-label">
              <label htmlFor="ask-ques-title">
                <h4>Title</h4>
                <p>Be specific and imagine you’re asking a question to another person.</p>
                <input
                  type="text"
                  id="ask-ques-title"
                  value={questionTitle}
                  onChange={handleTitleChange}
                  placeholder="e.g., How to implement JWT authentication?"
                />
              </label>
            </div>
            {isTitleFilled && (
              <div className="each-label">
                <label htmlFor="ask-ques-body">
                  <h4>What are the details of your problem?</h4>
                  <p>Introduce the problem and expand on what you put in the title. Minimum 20 characters.</p>
                  <MyEditor 
                    value={questionBody}
                    onChange={handleBodyChange}
                    placeholder="Write your question here..."
                  />
                </label>
              </div>
            )}
            {isBodyFilled && (
              <div className="each-label">
                <label htmlFor="ask-ques-tags">
                  <h4>Tags</h4>
                  <p>Add up to 5 tags to describe what your question is about. Start typing to see suggestions.</p>
                  <input
                    type="text"
                    id="ask-ques-tags"
                    value={questionTags}
                    onChange={(e) => setQuestionTags(e.target.value)}
                    placeholder="e.g., react jwt nodejs"
                  />
                </label>
              </div>
            )}
          </div>
          <button type="submit" className="review-btn">
            Review your question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestions;