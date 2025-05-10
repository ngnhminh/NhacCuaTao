import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const addSongInPlaylist = async (songId, playlistId) => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  try {
    const response = await axios.post(
        `${API_URL}/api/songInPlaylist/SongInPlaylistPostView/`,
        {
          action: "addSongInPlaylist",
          songId,
          playlistId,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",                     
          },
        }
      );
    return response.data;
  } catch (error) {
    console.error("Lỗi thêm bài hát:", error.response?.data || error.message);
  }
};

export const getSongsInPlaylistIds = async (playlistId) => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  try {
    const response = await axios.get(
      `${API_URL}/api/songInPlaylist/SongInPlaylistGetView/`,
      {
        params: {
          action: "getSongsInPlaylistIds",
          playlistId,
        },
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi thêm bài hát:", error.response?.data || error.message);
  }
};
