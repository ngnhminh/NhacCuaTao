import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getSongsInAlbumIds = async (albumId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/songInAlbum/SongInAlbumGetView/`,
      {
        params: {
          action: "getSongsInAlbumIds",
          albumId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi thêm bài hát:", error.response?.data || error.message);
  }
};
