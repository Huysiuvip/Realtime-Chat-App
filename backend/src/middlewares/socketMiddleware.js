import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const socketAuthMiddleware = async (socket, next) =>{
    try {
        const token = socket.handshake.auth?.token;
        if (!token){
            return next(new Error('Unauthorized - token not found'))
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decoded) {
            return next(new Error('unauthorized - Invalid or expired token'))
        }
        
        const user = await User.findById(decoded.userId).select('-hashedPassword');

        if(!user) {
            return next(new Error('User not found'))
        }

        socket.user = user;
        next();

    } catch (error) {
        console.error("JWT verification failed in socketMiddleware",error);
        next(new Error('Unauthorized'))
    }
}