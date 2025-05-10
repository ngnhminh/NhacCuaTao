import axios from 'axios';

const API_URL = "http://127.0.0.1:8000"; // Địa chỉ API 

export const login = async (email, password) => {
  try {
    // Gửi yêu cầu POST tới API để đăng nhập
    const response = await axios.post(`${API_URL}/api/users/login/`, {
      email: email,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw new Error("Failed to login");
  }
};

export const logout = async () => {
  const token = localStorage.getItem("userToken"); 
  if (token) {
    try {
      await axios.post(`${API_URL}/api/users/logout/`, {}, {
        headers: {
          Authorization: `Token ${token}` 
        }
      });
      localStorage.removeItem("userToken");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
};

export const getUserInform = async () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const response = await axios.get(`${API_URL}/api/users/OrtherActionView/`, {
        headers: {
          Authorization: `Token ${token}`
        },
        params: {
          action: "getUserInfo"
        }
      });      
      console.log("User info:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  } else {
    console.log("No token found in local storage.");
  }
};

export const uploadAvatar = async (formData) => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  try {
    formData.append("action", "uploadAvatar");

    const response = await axios.post(`${API_URL}/api/users/OrtherActionView/`, formData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Upload avatar error:", error);
    throw error;
  }
};

export const updateArtistInform = async (formData) => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  try {
    const response = await axios.post(
        `${API_URL}/api/artists/ArtistUpdateView/`,
        {
            full_name: formData.full_name,
            description: formData.description,
            country: formData.country,
            action: "updateArtistInform" 
        },
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );
    return response.data;
  } catch (error) {
      console.error("API Error:", error.message);
      throw new Error("Failed to request");
  }
};

