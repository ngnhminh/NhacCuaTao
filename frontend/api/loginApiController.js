import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/"; // Địa chỉ API của bạn

// Hàm login gọi API sử dụng axios
export const login = async (email, password) => {
  try {
    // Gửi yêu cầu POST tới API để đăng nhập
    const response = await axios.post(`${API_URL}/api/users/login/`, {
      email: email,
      password: password
    });
    // Trả về dữ liệu từ response (có thể là token, thông tin người dùng...)
    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw new Error("Failed to login");
  }
};
