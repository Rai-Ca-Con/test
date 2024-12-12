import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentsByAnswerId, createComment, deleteComment } from "../../actions/comments";
import "./CommentSection.css"; // Import the CSS file

export const CommentsSection = ({ answerId, questionId }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Lấy comments từ Redux store
  const comments = useSelector(
    (state) => state.comments.commentsByAnswerId[answerId] || [] // Lấy comments theo answerId
  );

  useEffect(() => {
    if (answerId && comments.length === 0) {
      // Gọi action chỉ khi chưa có comments
      dispatch(getCommentsByAnswerId(answerId)); // Truyền page và size mặc định nếu cần
    }
  }, [dispatch, answerId, comments.length]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(createComment(answerId, { content: newComment, questionId })); // Use questionId
      setNewComment("");
      setShowCommentBox(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId, answerId));
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.commentId} className="comment-item">
            <p >{comment.content} </p>
            <small className="comment-meta">
              By {comment.username} on{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </small>
            <button
              className="delete-comment-btn"
              onClick={() => handleDeleteComment(comment.commentId)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {showCommentBox ? (
        <div className="add-comment-box">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment} className="add-comment-btn">
            Submit
          </button>
          <button onClick={() => setShowCommentBox(false)} className="cancel-comment-btn">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setShowCommentBox(true)} className="show-comment-box-btn">
          Add Comment
        </button>
      )}
    </div>
  );
};

export default CommentsSection;
