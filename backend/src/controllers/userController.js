import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

    export const test = async (req, res) =>{
    return res.status(204);
}

export const searchUserByUserName = async (req, res) =>{
  try {
    const {userName} = req.query;

    if(!userName || userName.trim() == '') {
      return res.status(400).json({message: "Cần cung cấp userName trong query"});
    }
    
    const user = await User.findOne({userName : userName}).select("_id displayName avatarUrl")
   
  
    return res.status(200).json({user});
  } catch (error) {
    console.error("Lỗi khi tìm kiếm bạn bè", error);
    return res.status(500).json({message: "Error System"})
  }
};


export const uploadAvatar = async (req, res) =>{
  try {
    const file = req.file;
    const userId = req.user._id;

    if(!file){
      return res.status(400).json({message: "No file uploaded"})
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,{
        avatarUrl : result.secure_url,
        avatarId : result.public_id
      },
      {
        new : true
      }
    ).select("avatarUrl")

    if(!updatedUser){
        return res.status(400).json({message:"AvatarUrl null"})
      }

      return res.status(200).json({avatarUrl : updatedUser.avatarUrl})

  } catch (error) {
    console.error("Lỗi khi upload avatar lên cloudinary",error);
    return res.status(500).json({message : "Avatar Upload Failed"})
  }
}