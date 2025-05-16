import { login, logout,  getUserInform, uploadAvatar, updateArtistInform} from "../api/loginApiController"; 
import {requestArtistApprove, requestSongApprove} from "../api/requestApiController"; 
import {getAllArtist, getArtistInform} from "../api/artistApiController"; 
import {getAllfollowedArtistIds, followArtist, unfollowArtist} from "../api/artistFollowApiController"; 
import {getAllSong, getAllSongOfArtistById, increaseViewCount, downloadSong} from "../api/songApiController"
import {createPlaylist, getAllPlaylistIds, getPlaylistInform, uploadPlaylistAvatar, updatePlaylistInform, removePlaylist} from "../api/playlistApiController"
import {findSongInFavoriteSong, likedSong, getAllFavoriteSongIds, unlikedSong, getFavListInform} from "../api/favoriteSongApiController"
import {addSongInPlaylist, getSongsInPlaylistIds, removeSongInPlaylist} from "../api/songInPlaylistApiController"
import {getSongsInAlbumIds} from "../api/songInAlbumApiController"
import {addNewAlbum, getAllArtistAlbum, getAlbumInform} from "../api/albumApiController"
import {getAllNotification, notificationReaded} from "../api/notificationApiController"
import {getAllHistory, addToHistory} from "../api/historyApiController"

export const loginService = async (userInformation) => {
  // console.log(userInformation);
  try {
    const data = await login(userInformation.email, userInformation.password);

    if(data != null)
        console.log("ok")
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

export const getArtistInformService = async (id) => {
  try{
    const data = await getArtistInform(id);
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

export const uploadPlaylistAvatarService = async (formData) => {
  try{
    const data = await uploadPlaylistAvatar(formData);
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

export const updatePlaylistInformService = async (tempdata) => {
  try{
    const data = await updatePlaylistInform(tempdata);
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

export const getAllfollowedArtistIdsService = async () => {
  try{
    const data = await getAllfollowedArtistIds();
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

export const getAllSongOfArtistByIdService = async(id) => {
  try{
    const data = await getAllSongOfArtistById(id);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const increaseViewCountService = async (id) => {
  try{
    const data = await increaseViewCount(id);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getSongsInPlaylistIdsService = async (playlistId) => {
  try{
    const data = await getSongsInPlaylistIds(playlistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getSongsInAlbumIdsService = async (albumId) => {
  try{
    const data = await getSongsInAlbumIds(albumId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getPlaylistInformService = async (playlistId) => {
  try{
    const data = await getPlaylistInform(playlistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getFavListInformService = async () => {
  try{
    const data = await getFavListInform();
    return data;
  }catch (error){
    console.error("Get Info error:", error.message);
    throw error;
  }
}

export const addNewAlbumService = async (formData) => {
  console.log(formData)
  try{
    const data = await addNewAlbum(formData);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getAllArtistAlbumService = async (id) => {
  try{
    const data = await getAllArtistAlbum(id);
    return data;
  }catch (error){
    console.error("Get Info error:", error.message);
    throw error;
  }
}

export const getAlbumInformService = async (albumId) => {
  try{
    const data = await getAlbumInform(albumId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const removeSongInPlaylistService = async (songId, playlistId) => {
  try{
    const data = await removeSongInPlaylist(songId, playlistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const followArtistService = async (artistId) => {
  try{
    const data = await followArtist(artistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const unfollowArtistService = async (artistId) => {
  try{
    const data = await unfollowArtist(artistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const removePlaylistService = async (playlistId) => {
  try{
    const data = await removePlaylist(playlistId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const downloadSongService = async (songId) => {
  try{
    const data = await downloadSong(songId);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getAllNotificationService = async (type) => {
  try{
    const data = await getAllNotification(type);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const notificationReadedService = async (type) => {
  try{
    const data = await notificationReaded(type);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const getAllHistoryService = async () => {
  try{
    const data = await getAllHistory();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const addToHistoryService = async (song) => {
  try{
    const data = await addToHistory(song);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}
