import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; // Địa chỉ API 

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
  