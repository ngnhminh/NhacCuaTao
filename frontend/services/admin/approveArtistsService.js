import {getAllApproveArtistForms, deleteApproveArtistFormsById} from "../../api/requestApiController"; 

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