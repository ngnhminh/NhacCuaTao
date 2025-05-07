import { login, logout,  getUserInform, uploadAvatar, updateArtistInform} from "../api/loginApiController"; 
import {requestArtistApprove, requestSongApprove} from "../api/requestApiController"; 
import {getAllArtist} from "../api/artistApiController"; 
import {getAllSong} from "../api/songApiController"
import {createPlaylist, getAllPlaylistIds} from "../api/playlistApiController"
import {findSongInFavoriteSong, likedSong, getAllFavoriteSongIds, unlikedSong} from "../api/favoriteSongApiController"
import {addSongInPlaylist} from "../api/songInPlaylistApiController"

export const loginService = async (userInformation) => {
  // console.log(userInformation);
  try {
    const data = await login(userInformation.email, userInformation.password);

    if(data != null)
        console.log("ok")
    //Lưu token người dùng
    localStorage.setItem("userToken", data.token);
    return data;
  } catch (error) {
    console.error("Login Service Error:", error.message);
    throw error; 
  }
};

export const logoutService = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Logout Service Error:", error.message);
    throw error;
  }
};

export const getUserInformService = async () => {
  try{
    const data = await getUserInform();
    return data;
  }catch (error){
    console.error("Get Info error:", error.message);
    throw error;
  }
}

export const uploadAvatarService = async (formData) => {
  try{
    const data = await uploadAvatar(formData);
    return data;
  }catch (error){
    console.error("Get Info error:", error.message);
    throw error;
  }
};

export const requestArtistApproveService = async (fblink) => {
  try{
    const data = await requestArtistApprove(fblink);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

//Lấy tất cả nghệ sĩ
export const getAllArtistService = async () => {
  try{
    const data = await getAllArtist();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const updateArtistInformService = async (tempdata) => {
  try{
    const data = await updateArtistInform(tempdata);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const requestSongApproveService = async (formData) => {
  console.log(formData)
  try{
    const data = await requestSongApprove(formData);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}
export const getAllSongOfArtistService = async () => {
  try{
    const data = await getAllSong();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const createPlaylistService = async () => {
  try{
    const data = await createPlaylist();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const findSongInFavoriteSongService = async (songId) => {
  try{
    const data = await findSongInFavoriteSong(songId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const likedSongService = async (songId) => {
  try{
    const data = await likedSong(songId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const unlikedSongService = async (songId) => {
  try{
    const data = await unlikedSong(songId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getAllFavoriteSongIdsService = async () => {
  try{
    const data = await getAllFavoriteSongIds();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getAllPlaylistIdsService = async () => {
  try{
    const data = await getAllPlaylistIds();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const addSongInPlaylistService = async (songId, playlistId) => {
  try{
    const data = await addSongInPlaylist(songId, playlistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}