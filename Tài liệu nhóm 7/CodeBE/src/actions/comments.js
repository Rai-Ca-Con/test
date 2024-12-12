import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

export const CREATE_COMMENT = "CREATE_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const GET_COMMENTS = "GET_COMMENTS";
export const COMMENTS_ERROR = "COMMENTS_ERROR";

// Tạo bình luận
export const createComment = (answerId, commentDTO) => async (dispatch) => {
  try {
    const response = await axiosClient.post(`/comments/create`, { ...commentDTO, answerId });
    dispatch({
      type: CREATE_COMMENT,
      payload: response.data.result, // Response trả về đối tượng comment vừa tạo
    });
    toast.success("Comment created successfully!");
    window.location.reload();
  } catch (error) {
    dispatch({
      type: COMMENTS_ERROR,
      payload: error.response ? error.response.data : error.message,
    });
    console.error("Data", commentDTO)
    ;
  }
};

// Xóa bình luận
export const deleteComment = (commentId) => async (dispatch) => {
  try {
    await axiosClient.delete(`/comments/delete/${commentId}`);
    dispatch({
      type: DELETE_COMMENT,
      payload: commentId, // Truyền id của bình luận đã xóa
    });
    toast.success("Comment deleted successfully!");
    window.location.reload();
  } catch (error) {
    dispatch({
      type: COMMENTS_ERROR,
      payload: error.response ? error.response.data : error.message,
    });
    console.error("Error deleting comment");
  }
};

// Lấy bình luận theo AnswerId
export const getCommentsByAnswerId = (answerId, page = 1, size = 3) => async (dispatch) => {
  try {
    const response = await axiosClient.get(`/comments/byAnswer/${answerId}`, {
      params: {
        page: page,
        size: size,
        isDeleted: false, // Filter out deleted comments
      },
    });


    dispatch({
      type: GET_COMMENTS,
      payload: {
        answerId,
        comments: response.data.result.data, // Dispatching comments and answerId
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    dispatch({
      type: COMMENTS_ERROR,
      payload: error.response ? error.response.data : error.message,
    });
    toast.error("Error fetching comments for answer");
  }
};

// Lấy bình luận theo QuestionId
export const getCommentsByQuestionId = (questionId, page = 1, size = 3) => async (dispatch) => {
  try {
    const response = await axiosClient.get(`/comments/byQuestion/${questionId}`, {
      params: {
        page: page,
        size: size,
        isDeleted: false, // Nếu muốn lọc bình luận chưa bị xóa
      },
    });
    dispatch({
      type: GET_COMMENTS,
      payload: response.data.result, // Dữ liệu nhận được từ API
    });
  } catch (error) {
    dispatch({
      type: COMMENTS_ERROR,
      payload: error.response ? error.response.data : error.message,
    });
    toast.error("Error fetching comments for question");
  }
};
