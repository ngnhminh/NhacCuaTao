import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const getAllfollowedArtistIds = async () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const response = await axios.get(
        `${API_URL}/api/artistFollow/ArtistFollowGetView/`,
        {
          params: {
            action: "getAllfollowedArtistIds",
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

export const followArtist = async (artistId) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const response = await axios.post(
          `${API_URL}/api/artistFollow/ArtistFollowPostView/`,
          {
            action: "followArtist",
            artistId: artistId,
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

export const unfollowArtist = async (id) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try{
      const response = await axios.delete(`${API_URL}/api/artistFollow/ArtistFollowDeleteView/${id}/`,
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