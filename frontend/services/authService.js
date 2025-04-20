import { login } from "../api/loginApiController"; // import hàm login từ authApi

export const loginService = async (userInformation) => {
  console.log(userInformation);
  try {
    const data = await login(userInformation.email, userInformation.password);

    if(data != null)
        console.log("ok")
    // Xử lý dữ liệu trả về (như lưu token, thông tin người dùng)
    // Ví dụ: lưu vào localStorage hoặc set state trong app
    localStorage.setItem("userToken", data.token);

    return data; // trả về kết quả để xử lý tiếp ở nơi gọi service
  } catch (error) {
    console.error("Login Service Error:", error.message);
    throw error; // Để lỗi có thể được xử lý ở component
  }
};
