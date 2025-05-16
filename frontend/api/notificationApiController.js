import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getAllNotification = async (type) => {
  const token = localStorage.getItem("userToken");
  
  if (token) {
    try {
      const response = await axios.get(
        `${API_URL}/api/notifications/NotificationGetView/`,
        {
          params: {
            type: type,
            action: "getAllNotification",
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Kiểm tra" + type)
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy bài hát yêu thích:", error);
    }
  }
};

export const notificationReaded = async (type) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const response = await axios.post(
        `${API_URL}/api/notifications/NotificationPostView/`,
        {
            action: "notificationReaded",
            type: type,
        },
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );
      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật thông báo:", error);
    }
  }
};