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

export const uploadPlaylistAvatar = async (formData) => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  try {
    formData.append("action", "uploadPlaylistAvatar");

    const response = await axios.post(`${API_URL}/api/playlists/PlaylistUpdateView/`, formData, {
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

export const updatePlaylistInform = async (formData) => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  try {
    const response = await axios.post(
        `${API_URL}/api/playlists/PlaylistUpdateView/`,
        {
            id: formData.id,
            playlist_name: formData.playlist_name,
            action: "updatePlaylistInform" 
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

export const removePlaylist = async (id) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try{
      const response = await axios.delete(`${API_URL}/api/playlists/PlaylistDeleteView/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    }catch (error) {
      console.error("Lỗi hủy theo dõi nghệ sĩ:", error);
    }
  }
};