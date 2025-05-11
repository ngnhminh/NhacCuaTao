import axios from 'axios';
const API_URL = "http://127.0.0.1:8000"; 

export const addNewAlbum = async (formData) => {
    const token = localStorage.getItem("userToken");
    // for (let pair of formData.entries()) {
    //     console.log(`${pair[0]}: ${pair[1]}`);
    //   }
      
    if (token) {
      try {
        formData.append("action", "addNewAlbum");
        const response = await axios.post(
          `${API_URL}/api/albums/AlbumPostView/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "multipart/form-data"
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

export const getAllArtistAlbum = async (id) => {
const token = localStorage.getItem("userToken");
if (token) {
    try {
    const response = await axios.get(
        `${API_URL}/api/albums/AlbumGetView/`,
        {
        params: {
            action: "getAllArtistAlbum",
            artistId: id,
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

export const getAlbumInform = async (albumId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/albums/AlbumGetView/`,
        {
          params: {
            action: "getAlbumInform",
            albumId: albumId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy bài hát yêu thích:", error);
    }
  };
