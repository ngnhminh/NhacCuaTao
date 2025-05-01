import {getAllApproveArtistForms, deleteApproveArtistFormsById, approveArtist} from "../../api/requestApiController"; 

export const getAllApproveArtistFormsService = async () => {
    try{
        const data = await getAllApproveArtistForms();
        return data;
    }catch (error){
        console.error("Get list error:", error.message);
        throw error;
    }
}

export const deleteApproveArtistFormsByIdService = async (id) => {
    try{
        const data = await deleteApproveArtistFormsById(id);
        return data;
    }catch (error){
        console.error("Delete error:", error.message);
        throw error;
    }
}

export const approveArtistService = async (user, artist_name) => {
    try {
        const data = await approveArtist(user, artist_name);
        return data;
    }catch (error){
        console.error("Delete error:", error.message);
        throw error;
    }
}