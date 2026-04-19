import  express from 'express'
import  dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import friendRoute from './routes/friendRoute.js'
import messageRoute from './routes/messageRoute.js'
import cookieParser from 'cookie-parser'
import { protectedRoute } from './middlewares/authMiddleware.js';

import cors from "cors";

dotenv.config({ quiet: true }); // load cac bien moi truong

const app = express();  //khoi tao app bang express
const PORT = process.env.PORT  || 5001  // khai bao cong


// middlewares
app.use(express.json()); //giup express doc request duoi dang json
app.use(cookieParser())
app.use(cors({origin: process.env.CLIENT_URL, credentials:true}))
// public routes
app.use('/api/auth', authRoute)


//private routes
app.use(protectedRoute)
app.use('/api/users', userRoute)
app.use('/api/friends', friendRoute)
app.use('/api/message', messageRoute)




connectDB().then(() =>{
    // chay cong
app.listen(PORT, () =>{
    console.log(`sever bat dau tren cong http://localhost:${PORT}`)
})
});


