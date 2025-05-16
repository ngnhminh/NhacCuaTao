import {getAllUser, unlockUser, lockUser, deleteUser} from "../../api/userApiController"; 

export const getAllUserService = async () => {
  try{
    const data = await getAllUser();
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const unlockUserService = async (id) => {
  try{
    const data = await unlockUser(id);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const lockUserService = async (id) => {
  try{
    const data = await lockUser(id);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}

export const deleteUserService = async (id) => {
  try{
    const data = await deleteUser(id);
    return data;
  }catch (error){
    console.error("Request error:", error.message);
    throw error;
  }
}