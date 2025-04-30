import { createUser } from "../api/registerApiController"; // import hàm login từ authApi
import toast from 'solid-toast';

export const registerService = async (userInformation) => {
  console.log(userInformation);
  try {
    const data = await createUser (userInformation.email, userInformation.password, userInformation.name);
    if(data.exists){
        toast.error("Email đã tồn tại!");
        return null;
    }else{
      toast.success("Đăng ký thành công!");
    }
    return data; 
  } catch (error) {
    console.error("Register Service Error:", error.message);
    toast.error("Đăng ký thất bại! Vui lòng thử lại.");
    throw error;
  }
};
