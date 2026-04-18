import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Session from '../models/Session.js';
import crypto from "crypto"; 




const ACCESS_TOKEN_TTL = '30m'
const REFRESH_TOKEN_TTL = 14 * 24 * 60 *60* 1000; //14 day
export const signUp = async (req,res) =>{
    try {
        const {userName, password, email, firstName, lastName} = req.body
        if(!userName || !password || !email || !firstName || !lastName){
            return res.status(400).json({message :
                "Không được để thiếu dữ liệu"}
            )
        }

        // Kiểm tra username tồn tại chưa
        const duplicate = await User.findOne({userName})
        if(duplicate){
            return res.status(409).json({message:"UserName đã tồn tại"})
        }

        // Mã hóa password
        const hashedPassword = await bcrypt.hash(password,10);


        //tạo user mới
        await User.create({
            userName, 
            hashedPassword,
            email,
            displayName : `${firstName} ${lastName}`
        })

        //return
        return res.sendStatus(204)
    } catch (error) {
        console.error("Lỗi khi gọi SignUp",error);
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
}


export const signIn = async (req,res) =>{
    try {
        // lấy input
        const {userName, password} = req.body;
        if(!userName || !password){
            return res.status(400).json({message :
                "Không được để thiếu dữ liệu"}
            )
        }

        //lấy hashPassWord trong db để so với password input
        const user = await User.findOne({userName});
        if(!user){
            return res.status(401).json({message:"userName or password không chính xác"})
        }

        // kiểm tra  password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if(!passwordCorrect){
            return res.status(401).json({message:"userName or password không chính xác"})
        }

        // nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_TTL})


        // Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex")


        // tạo session mới để luw refresh token
        await Session.create(
            {
            userId: user._id,
            refreshToken,
            expires: new Date(Date.now() + REFRESH_TOKEN_TTL)
        }
        )
        // trả refresh token về trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly:true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL
        })


        // trả access token về trong res
        return res.status(200).json({message:`User ${user.displayName} đã login`,accessToken})
        
    } catch (error) {
        console.error("Lỗi khi gọi Signin",error);
        return res.status(500).json({message: "Lỗi hệ thống"})
    }

}

export const signOut = async (req, res)=>{

    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if(token){
        // xóa refresh token trong session
        await Session.deleteOne({refreshToken: token})

        //xóa refresh token trong cookie}
        res.clearCookie('refreshToken')
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi Signout",error);
        return res.status(500).json({message: "Lỗi hệ thống"})
    }


}


export const  refreshToken = async (req, res) =>{

        try {

            // lấy refresh token từ cookie
            const token = req.cookies?.refreshToken;
            if(!token){
                return res.status(401).json({message:"Token không tồn tại"})
            }

            // so sánh với refresh token trong database
            const session = await Session.findOne({refreshToken:token});

            if(!session){
                return res.status(403).json({message:"Token không hợp lệ hoặc hết hạn sử dụng"})
            }

            // kiểm tra hết hạn chưa
            if(session.expiresAt < new Date()){
                    return res.status(403).json({message:"Token đã hết hạn"})
            }

            
            // tạo access token mới
            const accessToken = jwt.sign({
                userId: session.userId,

            } , process.env.ACCESS_TOKEN_SECRET, {expiresIn:ACCESS_TOKEN_TTL})


            //return
            return res.status(200).json({accessToken})
            
        } catch (error) {
            console.error("Lỗi khi gọi refreshToken", error)
            return res.status(500).json({message:"Lỗi hệ thống"})
        }

}



