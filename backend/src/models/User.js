import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
       userName: {
       type: String,
       required: true,
       unique:true,
       trim:true,
       lowercase:true 
    },
    hashedPassword:{
        type : String,
        required: true,
    },
    email:{
        type: String,
       required: true,
       unique:true,
       trim:true,
       lowercase:true 
    },
    displayName:{
       type: String,
       required: true,
       trim:true,
    },
    avatarUrl:{
        type: String, // link hien thi hinh  
    },
    avatarId:{
        type: String, // cloudinary public_id de xoa hinh
    },
    bio:{
        type:String,
        sparse:true
    }
},
{
    timestamps : true
}
)

const User = mongoose.model("User", userSchema);
export default User;