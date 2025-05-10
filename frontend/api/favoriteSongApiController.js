import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const findSongInFavoriteSong = async (songId) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/favoriteSongs/FavoriteSongGetView/`, 
            { 
                action: "findSongInFavoriteSong",
                songId: songId
            }, 
            {
              headers: {
                Authorization: `Token ${token}`,
              },
          });
          
        return response.data;
      } catch (error) {
        console.error("Lỗi lấy bài hát:", error);
      }
    }
  };

  export const likedSong = async (songId) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const response = await axios.post(
          `${API_URL}/api/favoriteSongs/FavoriteSongPostView/`,
          {
            action: "likedSong",
            songId: songId,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Lỗi lấy bài hát:", error);
      }
    }
  };
  
export const getAllFavoriteSongIds = async () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const response = await axios.get(
        `${API_URL}/api/favoriteSongs/FavoriteSongGetView/`,
        {
          params: {
            action: "getAllFavoriteSongIds",
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

export const unlikedSong = async (id) => {
  return await axios.delete(`${API_URL}/api/favoriteSongs/FavoriteSongDeleteView/${id}/`);
};

export const getFavListInform = async() =>{
  const token = localStorage.getItem("userToken");
   if (token) {
    try {
      const response = await axios.get(
        `${API_URL}/api/favoriteSongs/FavoriteSongGetView/`,
        {
          params: {
            action: "getFavListInform",
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
}