import {getAllApproveSongsForms, approveSong, deleteApproveSongFormsById} from "../../api/requestApiController"; 

export const getAllApproveSongsFormsService = async () => {
    try{
        const data = await getAllApproveSongsForms();
        return data;
    }catch (error){
        console.error("Get list error:", error.message);
        throw error;
    }
}

export const approveSongService = async (artist, formId) => {
    try{
        const data = await approveSong(artist, formId);
        return data;
    }catch (error){
        console.error("Delete error:", error.message);
        throw error;
    }
}

export const deleteApproveSongFormsByIdService = async (id) => {
    try{
        const data = await deleteApproveSongFormsById(id);
        return data;
    }catch (error){
        console.error("Delete error:", error.message);
        throw error;
    }
}