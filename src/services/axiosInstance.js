import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance của axios với base URL và Bearer Token
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",  // Thay đổi baseURL nếu cần
  headers: {
    // Nếu token tồn tại trong cookie thì thêm vào header Authorization
    Authorization: `Bearer ${Cookies.get("auth_token") || ""}`,
  },
});

// Cấu hình axiosInstance nếu cần, ví dụ thêm interceptor:
axiosInstance.interceptors.request.use(
  (config) => {
    // Trước khi gửi yêu cầu, có thể thêm logic để kiểm tra token, refresh token, v.v.
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Nếu có lỗi khi gửi yêu cầu, xử lý tại đây
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu có lỗi trong phản hồi, xử lý tại đây, ví dụ: redirect nếu token hết hạn
    if (error.response && error.response.status === 401) {
      // Có thể điều hướng đến trang đăng nhập nếu token hết hạn
      window.location.href = "/login";  // Chuyển hướng đến trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;