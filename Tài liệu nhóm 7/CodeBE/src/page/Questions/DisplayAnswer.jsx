import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteAnswer, editAnswer, voteAnswers } from "../../actions/answers";
import {
  createComment,
  deleteComment,
  getCommentsByAnswerId,
} from "../../actions/comments";
import upVote from "../../ass/sort-up-solid.svg";
import downVote from "../../ass/sort-down-solid.svg";
import Avatar from "../../components/Avatar/Avatar";
import { toast } from "react-toastify";
import ReactHtmlParser from "html-react-parser";
import "./Questions.css";
import "./DisplayAnswer.css"; // Import the CSS file
import MyEditor from "../../components/MyEditor/MyEditor";
import { CommentsSection } from "../../components/Comment/CommentSection"; // Import CommentsSection
import {
  fetchQuestionDetails,
} from "../../actions/question";
import { fetchAnswersByQuestionId } from "../../actions/answers";

const DisplayAnswer = ({ answers, handleShare, question, onDeleteAnswer }) => {
  const User = useSelector((state) => state.currentUser);
  const commentsState = useSelector((state) => state.comments);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [answersState, setAnswers] = useState(answers);
  const [questionState, setQuestion] = useState(question);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [updatedBody, setUpdatedBody] = useState("");

  useEffect(() => {
    if (answers.length > 0) {
      // Fetch comments for each answer if not already fetched
      answers.forEach((answer) => {
        if (!commentsState?.commentsByAnswerId?.[answer.answerId]) {
          dispatch(getCommentsByAnswerId(answer.answerId));
        }
      });
    }
  }, [dispatch, answers, commentsState]);

  useEffect(() => {
    const loadQuestionAndAnswers = async () => {
      try {
        const questionData = await fetchQuestionDetails(id);
        setQuestion(questionData);
        const answersData = await fetchAnswersByQuestionId(id);
        setAnswers(answersData);
      } catch (error) {
        console.error("Error loading question or answers:", error);
      }
    };

    loadQuestionAndAnswers();
  }, [id]);

  // Handle deleting an answer
  const handleDelete = async (answerId, noOfAnswers, answerUserId) => {
    if (User?.result?._id !== answerUserId) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (confirmDelete) {
      const delAnswer = await dispatch(deleteAnswer(id, answerId, noOfAnswers));
      onDeleteAnswer(delAnswer);
    }
  };

  // Handle creating a new comment
  const handleCreateComment = (answerId) => {
    if (!newComment.trim()) return;
    dispatch(createComment(answerId, { body: newComment }));
    setNewComment(""); // Clear comment input after submission
  };

  // Handle deleting a comment
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  // Handle editing an answer
  const handleEdit = (answerId, oldBody) => {
    setEditingAnswerId(answerId); // Set the ID of the answer being edited
    setUpdatedBody(oldBody); // Set the current content in the editor
  };

  // Handle saving the edited answer
  const handleSaveEdit = (answerId) => {
    if (updatedBody.trim()) {
      dispatch(editAnswer(answerId, updatedBody)); // Dispatch action to update the answer
      setEditingAnswerId(null); // Close the editor
      setUpdatedBody(""); // Reset the editor content
    } else {
      toast.error("Answer cannot be empty.");
    }
  };

  const handleUpvote = async (answerId) => {
    if (!User) {
      toast.error("You need to be logged in to vote.");
      return;
    }

    try {
      await voteAnswers(answerId, "UPVOTE", questionState._id);
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.answerId === answerId
            ? { ...answer, score: answer.score + 1 }
            : answer
        )
      );
    } catch (error) {
      console.error("Error during upvote:", error);
    }
  };

  const handleDownvote = async (answerId) => {
    if (!User) {
      toast.error("You need to be logged in to vote.");
      return;
    }

    try {
      await voteAnswers(answerId, "DOWNVOTE", questionState._id);
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.answerId === answerId
            ? { ...answer, score: answer.score - 1 }
            : answer
        )
      );
    } catch (error) {
      console.error("Error during downvote:", error);
    }
  };

  return (
    <div>
      {answers.map((answer) => (
        <div className="display-ans" key={answer.answerId}>
          <div className="answer-details-container">
            <div className="answer-content">
              <div className="answer-votes-container">
                <div className="answer-votes">
                  <img
                    src={upVote}
                    className={`votes-icon ${answer.userVote === "UPVOTE" ? "active-vote" : ""}`}
                    onClick={() => handleUpvote(answer.answerId)}
                    alt="Upvote"
                    width="18px"
                  />
                  <p>{answer.score || 0}</p>
                  <img
                    src={downVote}
                    className={`votes-icon ${answer.userVote === "DOWNVOTE" ? "active-vote" : ""}`}
                    onClick={() => handleDownvote(answer.answerId)}
                    alt="Downvote"
                    width="18px"
                  />
                </div>
              </div>

              <div className="answer-body-container">
                {editingAnswerId === answer.answerId ? (
                  <div>
                    <MyEditor value={updatedBody} onChange={setUpdatedBody} />
                    <div className="edit-buttons">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveEdit(answer.answerId)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingAnswerId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{ReactHtmlParser(answer.body)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="question-actions-user">
            <div>
              {editingAnswerId !== answer.answerId && (
                <>
                  <button type="button" onClick={handleShare}>
                    Share
                  </button>
                  {User?.result?._id === answer?.userId && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEdit(answer.answerId, answer.body)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            answer.answerId,
                            questionState.noOfAnswers,
                            answer.userId
                          )
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <div>
              <p>Answered {moment(answer.createdAt).fromNow()}</p>
              <Link
                to={`/Users/${answer.userId}`}
                className="user-link"
                style={{ color: "#0086d8" }}
              >
                <Avatar backgroundColor="green" px="8px" py="5px">
                  {answer.username.charAt(0).toUpperCase()}
                </Avatar>
                <div>{answer.username}</div>
              </Link>
            </div>
          </div>

          {/* Comments Section */}
          <CommentsSection answerId={answer.answerId} questionId={answer.questionId}  />

        </div>
      ))}
    </div>
  );
};

export default DisplayAnswer;
