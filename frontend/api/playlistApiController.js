import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const createPlaylist = async () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const response = await axios.post(`${API_URL}/api/playlists/PlaylistPostView/`, 
            { action: "createPlaylist" }, 
            {
              headers: {
                Authorization: `Token ${token}`,
              },
          });
          
        return response.data;
      } catch (error) {
        console.error("Lỗi tạo playlist:", error);
      }
    }
  };

  export const getAllPlaylistIds = async () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const response = await axios.get(
          `${API_URL}/api/playlists/PlaylistGetView/`,
          {
            params: {
              action: "getAllPlaylistIds",
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

  export const getPlaylistInform = async (playlistId) => {
    console.log("idd" + playlistId)
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const response = await axios.get(
          `${API_URL}/api/playlists/PlaylistGetView/`,
          {
            params: {
              action: "getPlaylistInform",
              playlistId
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
