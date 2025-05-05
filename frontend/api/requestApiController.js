import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; // Địa chỉ API 

//Gửi thông tin duyệt nghệ sĩ
export const requestArtistApprove = async (fblink) => {
    const token = localStorage.getItem("userToken");
    if (token) {
        try {
            const response = await axios.post(
                `${API_URL}/api/requests/RequestView/`,
                {
                    fblink: fblink,
                    action: "requestArtistApprove" 
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
    }
};

export const getAllApproveArtistForms = async () => {
    try {
    const response = await axios.get(`${API_URL}/api/requests/ArtistApproveForm/`, {
        params: {
            action: "getAllApproveArtistForms"
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const deleteApproveArtistFormsById = async (id) => {
    return await axios.delete(`${API_URL}/api/requests/ArtistApproveDeleteForm/${id}/`);
};

export const approveArtist = async (user, artist_name, formId) => {
    try {
    const response = await axios.post(`${API_URL}/api/requests/ArtistApproveForm/`, 
        {
            user: user,
            artist_name: artist_name,
            formId: formId,
            action: "approveArtist" 
        }
    );      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

//Gửi thông tin duyệt bài hát
export const requestSongApprove = async (formData) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        formData.append("action", "requestSongApprove");
        const response = await axios.post(
          `${API_URL}/api/requests/RequestView/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "multipart/form-data"
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("API Error:", error.message);
        throw new Error("Failed to request");
      }
    }
  };
  
  export const getAllApproveSongsForms = async () => {
    try {
    const response = await axios.get(`${API_URL}/api/requests/SongApproveForm/`, {
        params: {
            action: "getAllApproveSongsForms"
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const approveSong = async (artist, formId) => {
    try {
    const response = await axios.post(`${API_URL}/api/requests/SongApproveForm/`, 
        {
            artist: artist,
            formId: formId,
            action: "approveSong" 
        }
    );      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const deleteApproveSongFormsById = async (id) => {
    return await axios.delete(`${API_URL}/api/requests/SongApproveDeleteForm/${id}/`);
};