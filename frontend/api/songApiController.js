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

export const getAllSongOfArtistById = async (id) => {
    try {
    const response = await axios.get(`${API_URL}/api/songs/SongGetView/`, {
        params: {
            action: "getAllSongOfArtistById",
            artistId: id
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const increaseViewCount = async (id) => {
    try {
      const response = await axios.post(
          `${API_URL}/api/songs/SongUpdateView/`,
          {
            action: "updateSongView",
            songId: id
          },
      );
      return response.data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw new Error("Failed to request");
    }
};

export const downloadSong = async (songId) => {
    try {
    const response = await axios.get(`${API_URL}/api/songs/SongGetView/`, {
        params: {
            action: "downloadSong",
            songId: songId
        }
    });      
    return response.data;
    } catch (error) {
        console.error("Error lấy danh sách duyệt nghệ sĩ:", error);
    }
};

export const deleteSong = async (id) => {
    try{
      const response = await axios.delete(`${API_URL}/api/songs/SongDeleteView/${id}/`);
      return response.data;
    }catch (error) {
      console.error("Lỗi hủy theo dõi nghệ sĩ:", error);
    }
};