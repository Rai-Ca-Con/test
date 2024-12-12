import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// Action đăng ký
export const signUp = (userData, navigate) => async (dispatch) => {
  try {
    const response = await axiosClient.post("/users/create", userData);
    console.log("Response:", response); // Log the response to verify it
    toast.success(
      "Account created successfully! 🎉 You will be redirected in 3 seconds.",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );

    setTimeout(() => {
      navigate("/", { state: { registered: true } });
    }, 3000);
  } catch (error) {
    console.error("Error creating account:", error);
  }
};

// Action đăng nhập (thêm vào nếu cần)
export const logIn = (userData, navigate) => async (dispatch) => {
  try {
    const response = await axiosClient.post("/authen/login", userData);
    console.log("Response from login API:", response.data);  // Log toàn bộ response từ API

    // Sửa lại phần kiểm tra và lưu trữ token
    if (response.data && response.data.result && response.data.result.accessToken && response.data.result.refreshToken) {
      // Lưu accessToken và refreshToken vào localStorage
      localStorage.setItem("token", response.data.result.accessToken);
      localStorage.setItem("refreshToken", response.data.result.refreshToken);
      console.log("Stored refreshToken:", localStorage.getItem("refreshToken"));  
      console.log("Stored token:", localStorage.getItem("token"));
      
      // Fetch thông tin người dùng
      const userInfoResponse = await axiosClient.get("/users/getMyInfo");
      const { userId, username } = userInfoResponse.data.result;

      // Lưu thông tin người dùng vào Redux và localStorage
      dispatch({ type: "SET_USER_INFO", payload: { userId, username } });
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);

      toast.success("Logged in successfully!");
      navigate("/");
      window.location.reload();
    } else {
      toast.error("Không có refreshToken trong phản hồi đăng nhập.");
    }
  } catch (error) {
    console.error("Error logging in:", error.response ? error.response.data : error);
    throw error;
  }
};




// Action để lấy thông tin người dùng
export const getMyInfo = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/users/getMyInfo"); // Gọi API để lấy thông tin người dùng
    console.log("User Info:", response.data); // In ra thông tin người dùng

    // Dispatch một action nếu cần thiết (ví dụ: lưu thông tin người dùng vào Redux store)
    dispatch({
      type: "SET_USER_INFO",
      payload: response.data.result, // Hoặc payload: { userId: response.data.result.userId, username: response.data.result.username }
    });

    return {
      userId: response.data.result.userId, // Include the userId
      userInfo: response.data.result, // Keep user info if needed
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
  }
};

export const fetchUserInfo = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/users/getMyInfo");
    const { userId, username } = response.data.result;
    console.log("User Info:", { userId, username });
    // Dispatch thông tin userId và username vào store
    dispatch({ type: "SET_USER_INFO", payload: { userId, username } });
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

