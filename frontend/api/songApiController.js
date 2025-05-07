import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getAllSong = async () => {
    try {
    const response = await axios.get(`${API_URL}/api/songs/SongGetView/`, {
        params: {
            action: "getAllSong"
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};