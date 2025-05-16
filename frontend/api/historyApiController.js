import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getAllHistory = async () => {
  const token = localStorage.getItem("userToken");
  
  if (token) {
    try {
      const response = await axios.get(
        `${API_URL}/api/history/HistoryGetView/`,
        {
          params: {
            action: "getAllHistory",
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy bài hát yêu thích:", error);
    }
  }
};

export const addToHistory = async (song) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const response = await axios.post(
        `${API_URL}/api/history/HistoryPostView/`,
        {
            action: "addToHistory",
            songId: song.id,
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