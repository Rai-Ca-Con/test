import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import copy from "copy-to-clipboard";
import upVote from "../../ass/sort-up-solid.svg";
import downVote from "../../ass/sort-down-solid.svg";
import Avatar from "../../components/Avatar/Avatar";
import DisplayAnswer from "./DisplayAnswer";
import {
  fetchQuestionDetails,
  voteQuestion,
  deleteQuestion,
} from "../../actions/question";
import { handlePostAnswerAction } from "../../actions/answers";
import { fetchAnswersByQuestionId } from "../../actions/answers";
import { toast } from "react-toastify";
import ReactHtmlParser from "html-react-parser";
import MyEditor from "../../components/MyEditor/MyEditor"; // Import MyEditor
import "./EditQuestion.css";
import { Client } from "@stomp/stompjs";

const QuesDetailsDisplay = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);
  const location = useLocation();
  const url = "http://localhost:3000";
  const [client, setClient] = useState(null);
  
  useEffect(() => {
    const loadQuestionDetails = async () => {
      try {
        const questionData = await fetchQuestionDetails(id);
        setQuestion(questionData);
        setAnswers(questionData.answers || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadQuestionDetails();
  }, [id]);
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

  useEffect(() => {
    // Tạo STOMP client
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws", // URL tới endpoint WebSocket
      // connectHeaders: {
      //   Authorization: "Bearer " + localStorage.getItem("token").toString(), // Gửi token nếu cần xác thực
      // },
      debug: (str) => console.log(str), // Log để debug
      reconnectDelay: 5000, // Tự động kết nối lại sau 5s
      onConnect: () => {
        console.log("Connected to WebSocket");
        // Đăng ký topic để nhận thông điệp
        stompClient.subscribe("/topic/answers", (data) => {
          const type = (JSON.parse(data.body)).type.toUpperCase();
          if(type === "CREATE"){
            const answer = (JSON.parse(data.body)).message;
            console.log(answers);
            setAnswers((answers) => [answer, ...answers]);
          }

          if(type === "DELETE"){
            const answer = (JSON.parse(data.body)).message;
            console.log(answers);
            setAnswers((prevAnswers) => prevAnswers.filter((ans) => ans.answerId !== answer.answerId));
          }
        });
      },
      onStompError: (error) => {
        console.error("STOMP error:", error);
      },
    });
    stompClient.activate();
    setClient(stompClient);

    // Cleanup connection khi component bị unmount
    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerBody) return alert("Answer cannot be empty");

    try {
      const newAnswer = await dispatch(
        handlePostAnswerAction(
          id,
          answerBody,
          user?.result?._id,
          user?.result?.username
        )
      );

      if (client && client.connected) {
        client.publish({
          destination: "/app/createAnswer", // Endpoint server xử lý
          body: JSON.stringify(newAnswer), // Nội dung message
        });
        setAnswerBody("");
      }

      // setAnswers([...answers, newAnswer]);
      // setAnswerBody("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = () => {
    copy(url + location.pathname);
    toast.success("Copied URL: " + url + location.pathname, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleUpvote = async () => {
    if (!user) {
      toast.error("You need to log in to vote.");
      return;
    }

    try {
      await voteQuestion(id, "upVote");
      const updatedQuestion = await fetchQuestionDetails(id);
      setQuestion(updatedQuestion); // Update the question with new votes
    } catch (error) {
      console.error("Error during upvote:", error);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      toast.error("You need to log in to vote.");
      return;
    }

    try {
      await voteQuestion(id, "downVote");
      const updatedQuestion = await fetchQuestionDetails(id);
      setQuestion(updatedQuestion); // Update the question with new votes
    } catch (error) {
      console.error("Error during downvote:", error);
    }
  };

  const handleDelete = (questionId, noOfAnswers) => {
    if (user?.result?._id !== question.userId) {
      toast.error("Bạn không thể xóa câu trả lời của người khác.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (confirmDelete) {
      dispatch(deleteQuestion(id, questionId, noOfAnswers));
      toast.success(
        "Question deleted successfully! Redirecting to the homepage...",
        {
          position: "top-right",
          autoClose: 10,
        }
      );

      setTimeout(() => {
        navigate("/", { state: { deleteQuestion: true } });
      }, 10);
    }
  };

  const handleDeleteAnswer = (delAnswer) => {
    if (client && client.connected) {
      client.publish({
        destination: "/app/deleteAnswer", // Endpoint server xử lý
        body: JSON.stringify(delAnswer), // Nội dung message
      });
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="question-details-page">
      <section className="question-details-container">
        <h1>{question.title}</h1>
        <div className="question-details-container-2">
          <div className="question-votes">
            <img
              src={upVote}
              className="votes-icon"
              onClick={handleUpvote}
              alt="Upvote"
              width="18px"
            />
            <p>{question.score || 0}</p>
            <img
              src={downVote}
              className="votes-icon"
              onClick={handleDownvote}
              alt="Downvote"
              width="18px"
            />
          </div>

          <div style={{ width: "100%" }}>
            <p className="question-body">{ReactHtmlParser(question.body)}</p>
            <div className="question-details-tags">
              {question.tags.map((tag) => (
                <p key={tag.tagId}>{tag.name}</p>
              ))}
            </div>
            <div className="question-actions-user">
              <div>
                <button type="button" onClick={handleShare}>
                  Share
                </button>
                {user?.result?._id === question?.userId && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(question.answerId, question.noOfAnswers)
                    }
                  >
                    Delete
                  </button>
                )}

                {user?.result?._id === question?.userId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/Questions/${id}/edit`)}
                  >
                    Edit
                  </button>
                )}
              </div>
              <div>
                <p>asked {moment(question.createdAt).fromNow()}</p>
                <Link
                  to={`/Users`}
                  className="user-link"
                  style={{ color: "#00086d8" }}
                >
                  <Avatar backgroundColor="orange" px="8px" py="5px">
                    {question.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>{question.username}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {answers.length > 0 && (
        <section>
          <h3>
            {answers.length} {answers.length === 1 ? "answer" : "answers"}
          </h3>
          <DisplayAnswer
            question={question}
            answers={answers}
            handleShare={handleShare}
            onDeleteAnswer={handleDeleteAnswer}
          />
        </section>
      )}
      <section className="post-ans-container">
        <h3>Your Answer</h3>
        <form onSubmit={handleSubmit}>
          {/* MyEditor for answering */}
          <MyEditor value={answerBody} onChange={setAnswerBody} />
          <br />
          <input
            type="submit"
            className="post-ans-btn"
            value="Post your Answer"
          />
        </form>
        <p>
          Browse other questions tagged
          {question.tags.map((tag) => (
            <Link to="/Tags" key={tag.tagId} className="ans-tags">
              {tag.name}
            </Link>
          ))}{" "}
          or
          <Link
            to="/AskQuestion"
            style={{ textDecoration: "none", color: "#009dff" }}
          >
            {" "}
            ask your question
          </Link>
        </p>
      </section>
    </div>
  );
};

export default QuesDetailsDisplay;