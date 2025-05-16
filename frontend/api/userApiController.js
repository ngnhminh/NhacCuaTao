import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getAllUser = async () => {
    try {
    const response = await axios.get(`${API_URL}/api/users/OrtherActionView/`, {
        params: {
            action: "getAllUser"
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const unlockUser = async (id) => {
  try {
    const response = await axios.post(
        `${API_URL}/api/users/OrtherActionView/`,
        {
            id: id,
            action: "unlockUser" 
        }
    );
    return response.data;
  } catch (error) {
      console.error("API Error:", error.message);
      throw new Error("Failed to request");
  }
};

export const lockUser = async (id) => {
  try {
    const response = await axios.post(
        `${API_URL}/api/users/OrtherActionView/`,
        {
            id: id,
            action: "lockUser" 
        }
    );
    return response.data;
  } catch (error) {
      console.error("API Error:", error.message);
      throw new Error("Failed to request");
  }
};


export const deleteUser = async (id) => {
    try{
      const response = await axios.delete(`${API_URL}/api/users/UserDeleteView/${id}/`);
      return response.data;
    }catch (error) {
      console.error("Lỗi hủy theo dõi nghệ sĩ:", error);
    }
};