import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; // Địa chỉ API 

export const createUser = async (email, password, full_name, avatar_url = "") => {
  try {
    // Gửi yêu cầu POST tới API để đăng nhập
    const response = await axios.post(`${API_URL}/api/users/register/`, {
      email: email,
      password: password,
      full_name: full_name,
      avatar_url
    });
    // Trả về dữ liệu từ response (có thể là token, thông tin người dùng...)
    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw new Error("Failed to login");
  }
};