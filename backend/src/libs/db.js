import mongoose from 'mongoose'


export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
        console.log("Lien ket csdl thanh cong")
    }catch(error)
    {
        console.log("loi khi lien ket csdl",error);
        process.exit(1)
    }
}