import axios from "axios";
import { toast } from "react-toastify";

// Tạo một instance của axios
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false; // Trạng thái refresh token
let failedQueue = []; // Lưu các request bị pending

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm logout người dùng
const logOut = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (refreshToken) {
      await axiosClient.post("/authen/logout", { token: refreshToken });
    }
  } catch (error) {
    console.error("[Logout Error]:", error);
  } finally {
    localStorage.clear();
    window.location.href = "/Auth";
    toast.error("Session expired. Please log in again.");
  }
};

// Hàm làm mới accessToken sử dụng refreshToken
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.error("[Refresh] No refresh token found.");
    throw new Error("Refresh token missing.");
  }

  try {
    console.log("[Refresh] Requesting new access token...");
    const response = await axios.post(
      "/authen/refreshToken",
      { token: refreshToken },
      { baseURL: "http://localhost:8080/api/v1" }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.result || {};
    if (accessToken && newRefreshToken) {
      console.log("[Refresh] New tokens received:", { accessToken, newRefreshToken });
      // Lưu cả token mới vào localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Cập nhật header Authorization của axiosClient với token mới
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return accessToken;
    } else {
      throw new Error("[Refresh] Invalid response structure.");
    }
  } catch (error) {
    console.error("[Refresh Error]:", error);
    throw error;
  }
};
// Interceptor xử lý response lỗi
axiosClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Trường hợp token hết hạn, xử lý refresh token
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          isRefreshing = false;

          toast.info("Phiên đăng nhập đã được làm mới.", { toastId: "refresh-success" });

          return axiosClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          logOut();
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }
    // Kiểm tra nếu lỗi nhập sai mật khẩu
    if (error.response?.status === 401 && error.response.data?.message === "Invalid credentials") {
      toast.error("Sai mật khẩu hoặc tài khoản. Vui lòng thử lại.");
      return Promise.reject(error); // Dừng xử lý thêm
    }

    // Các lỗi khác từ backend
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = data?.code;
      const errorMessage = data?.message;
    
      if (errorCode) {
        // Không sử dụng toastId hoặc chỉ sử dụng toast.error mà không có ID trùng lặp
        toast.error(`Error ${errorCode}: ${errorMessage}`);
      } else {
        toast.error(errorMessage || "Có lỗi xảy ra.");
      }
    
      console.error(`[Response Error ${status}]:`, errorMessage);
    } else {
      toast.error("Không thể kết nối với máy chủ. Vui lòng thử lại sau.");
    }
    

    return Promise.reject(error);
  }
);



export default axiosClient;