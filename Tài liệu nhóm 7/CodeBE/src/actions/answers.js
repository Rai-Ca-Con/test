import axiosClient from '../api/axiosClient';
import { fetchQuestionDetails } from './question';
import { toast } from "react-toastify";

export const handlePostAnswerAction = (questionId, answerBody, userId, username) => async (dispatch) => {
  try {
    // Log các giá trị để kiểm tra
    console.log("Submitting Answer:");
    console.log("Answer Body:", answerBody);
    console.log("Question ID:", questionId);
    console.log("User ID:", userId);
    console.log("Username:", username);

    const response = await axiosClient.post(`/answers/create`, {
      body: answerBody,
      questionId,
      username,
      userId // Nếu cần thiết
    });

    // window.location.reload();
    toast.success("Answer posted successfully!");

    if (response.data && response.data.result) {
      // dispatch(fetchQuestionDetails(questionId));
      return response.data.result; // Return the new answer data
    }
  } catch (error) {
    if (error.response) {
      console.error("Error posting answer:", error.response.data);
      console.log("Submitting Answer:");
      console.log("Answer Body:", answerBody);
      console.log("Question ID:", questionId);
      console.log("User ID:", userId);
      console.log("Username:", username);
    } else {
      console.error("Error posting answer:", error.message);
    }
    throw error;
  }
};

export const fetchAnswersByQuestionId = async (id) => {
    try {
      // Sử dụng URL chính xác với questionId
      const response = await axiosClient.get(`/answers/getAnswersByQuestion?questionId=${id}`);
    //   console.log("Response data:", response.data); // Log ra dữ liệu trả về để kiểm tra cấu trúc
      if (response.data && response.data.result && response.data.result.data.length > 0) {
        return response.data.result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching answers:", error.response || error.message || error);
      throw error;
    }
  };
  
  export const deleteAnswer = (questionId, answerId, noOfAnswers) => async (dispatch) => {
    try {
      const response = await axiosClient.delete(`/answers/delete/${answerId}`);
      console.log("Deleted answer response:", response);
  
      toast.success('🦄 Answer delete successfully', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // onClose: () => window.location.reload(),
        });
      // window.location.reload();
      // dispatch(fetchQuestionDetails(questionId));
      return response.data.result; 
    } catch (error) {
    }
  };
  export const editAnswer = (answerId, updatedBody) => async (dispatch) => {
    try {
      const response = await axiosClient.put(`/answers/update/${answerId}`, {
        body: updatedBody,
      });
  
      console.log("Updated answer response:", response.data);
      toast.success("Answer updated successfully!");
      dispatch({
        type: "UPDATE_ANSWER_SUCCESS",
        payload: response.data, 
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating answer:", error.response?.data || error.message);
      toast.error("Failed to update answer.");
      dispatch({
        type: "UPDATE_ANSWER_FAILURE",
        payload: error.response?.data || error.message,
      });
    }
  };
  export const voteAnswers = async (answerId, voteType, questionId) => {
    try {
      // Xác định endpoint dựa trên voteType
      const endpoint = voteType === "UPVOTE" 
        ? `/votes/answer/upvote/${answerId}` 
        : `/votes/answer/downvote/${answerId}`;
  
      // Gửi request tới API
      const response = await axiosClient.post(endpoint);
  
      console.log("Vote response:", response.data);
  
      // Hiển thị thông báo thành công
      toast.success(`Answer ${voteType.toLowerCase()}d successfully!`);
  
      return response.data.result; // Trả về kết quả đã cập nhật
    } catch (error) {
      console.error("Error voting answer:", error.response?.data || error.message);
      throw error; // Ném lỗi để xử lý sau này nếu cần
    }
  };
  

  
