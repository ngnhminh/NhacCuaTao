import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getAllArtist = async () => {
    try {
    const response = await axios.get(`${API_URL}/api/artists/ArtistGetView/`, {
        params: {
            action: "getAllArtist"
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const getArtistInform = async (id) => {
    try {
    const response = await axios.get(`${API_URL}/api/artists/ArtistGetView/`, {
        params: {
            action: "getArtistInform",
            artistId: id
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};