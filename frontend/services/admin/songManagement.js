import {deleteSong} from "../../api/songApiController"; 

export const deleteSongService = async (id) => {
  try{
    const data = await deleteSong(id);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}