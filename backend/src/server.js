import  express from 'express'
import  dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import friendRoute from './routes/friendRoute.js'
import messageRoute from './routes/messageRoute.js'
import conversationRoute from './routes/conversationRoute.js'
import cookieParser from 'cookie-parser'
import { protectedRoute } from './middlewares/authMiddleware.js';
import {app, server} from './socket/index.js'
import { v2 as cloudinary } from 'cloudinary';

import cors from "cors";

dotenv.config({ quiet: true }); // load cac bien moi truong

// const app = express();  //khoi tao app bang express
const PORT = process.env.PORT  || 5001  // khai bao cong


// middlewares
app.use(express.json()); //giup express doc request duoi dang json
app.use(cookieParser())
app.use(cors({origin: process.env.CLIENT_URL, credentials:true}))
// public routes
app.use('/api/auth', authRoute)


// CLOUDINARY Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


//private routes
app.use(protectedRoute)
app.use('/api/users', userRoute)
app.use('/api/friends', friendRoute)
app.use('/api/message', messageRoute)
app.use('/api/conversations', conversationRoute)




connectDB().then(() =>{
    // chay cong
server.listen(PORT, () =>{
    console.log(`sever bat dau tren cong http://localhost:${PORT}`)
})
});


