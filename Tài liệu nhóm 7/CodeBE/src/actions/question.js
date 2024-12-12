import axiosClient from '../api/axiosClient';
import { toast } from "react-toastify";

export const fetchQuestionDetails = async (id) => {
  try {
    const response = await axiosClient.get(`/questions/getQuestionsByConditions?questionId=${id}`);
    if (response.data && response.data.result && response.data.result.data.length > 0) {
      const question = response.data.result.data.find(q => q.questionId === id);
      if (question) {
        return question;
      }
    } 
  } catch (error) {
    console.error("Error fetching question details:", error);
    throw error;
  }
};
//Hàm lấy tag từ sever 

  
  export const voteQuestionAction = async (id, type, userId) => {
    try {
      await voteQuestion(id, type, userId);
    } catch (error) {
      console.error(`Error ${type === "upVote" ? "upvoting" : "downvoting"} question:`, error);
      throw error;
    }
  };


export const handleVoteAction = async (id, type, userId, setQuestion) => {
    try {
      await voteQuestion(id, type, userId);
      const updatedQuestion = await fetchQuestionDetails(id);
      setQuestion(updatedQuestion);
    } catch (error) {
      console.error(`Error ${type === "upVote" ? "upvoting" : "downvoting"} question:`, error);
      throw error;
    }
  };


  export const askQuestion = (questionData, navigate) => async (dispatch) => {
    try {
      const response = await axiosClient.post("/questions/create", questionData, {
       
      });
      console.log("Question Posted:", response.data);
      // Nếu thành công, điều hướng đến trang hiển thị câu hỏi hoặc thông báo
      toast.success("Question posted successfully!");
      navigate(`/Questions/${response.data.result.questionId}`);
    } catch (error) {
      console.error("Error posting question:", error);
      // alert("You need to log in to post a question.");
      // navigate("/Auth");
    }
  };



export const postAnswer = (answerData) => async (dispatch) => {

}

export const deleteQuestion = (questionId, noOfAnswers) => async (dispatch) => {
  try {
    const response = await axiosClient.delete(`/questions/delete/${questionId}`);
    console.log("Deleted question response:", response);

    // Hiển thị thông báo thành công
    toast.success("Câu hỏi đã được xóa thành công!");

    // Cập nhật danh sách câu hỏi hoặc làm mới thông tin
  } catch (error) {
    console.error("Error deleting question:", error);

    // Kiểm tra nếu có phản hồi từ server
    if (error.response) {
      // Nếu mã trạng thái là 403, hiển thị thông báo cụ thể
      if (error.response.status === 403) {
        // toast.error("Bạn không có quyền truy cập để xóa câu hỏi này.");
      } else {
      }
    }
  }
};

export const updateQuestion = async (quesId, updatedData, setQuestion) => {
  try {
    const response = await axiosClient.put(`/questions/update/${quesId}`, {
      ...updatedData,
      acceptedAnswerId: updatedData.acceptedAnswerId || "", // Truyền giá trị rỗng nếu không có
    });

    if (response.data && response.data.result) {
      toast.success("Câu hỏi đã được cập nhật thành công!");
      setQuestion(response.data.result); // Cập nhật giao diện
    }
  } catch (error) {
    console.error("Error updating question:", error);
    if (error.response && error.response.data.message) {
      console.log("Response data:", error.response.data);
      console.log("Status code:", error.response.status);
      console.log("Headers:", error.response.headers);
    } else {
      toast.error("Đã xảy ra lỗi khi cập nhật câu hỏi.");
    }
  }
};


export const voteQuestion = async (id, type) => {
  try {
    const endpoint =
      type === "upVote"
        ? `/votes/question/upvote/${id}`
        : `/votes/question/downvote/${id}`;
    const response = await axiosClient.post(endpoint);

    // Display success toast based on the type of vote
    toast.success(
      `Question ${type === "upVote" ? "upvoted" : "downvoted"} successfully!`
    );

    return response.data.result; // Return updated vote details
  } catch (error) {
    console.error(`Error ${type === "upVote" ? "upvoting" : "downvoting"}:`, error);
    throw error;
  }
};
