import { login, logout,  getUserInform, uploadAvatar} from "../api/loginApiController"; 
import {requestArtistApprove} from "../api/requestApiController"; 

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