import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import { socketAuthMiddleware } from '../middlewares/socketMiddleware.js';
import { getUserConversationForSocketIo } from '../controllers/conversationController.js';


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin  : process.env.CLIENT_URL,
        credentials : true,
    }
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map();

io.on("connection", async (socket) =>{
    const user = socket.user;
    console.log(`${user.displayName} online with ${socket.id}`);
    // thêm user vào danh sách online
    onlineUsers.set(user._id, socket.id);
    // thông báo cho client có người online
    io.emit("online-users", Array.from(onlineUsers.keys()))

    // lấy danh sách id của 1 conversation
    const conversationIds = await getUserConversationForSocketIo(user._id);
    conversationIds.forEach((id) => {
        socket.join(id);
    });

    socket.on("join-conversation", (conversationId)=>{
        socket.join(conversationId)
    });

    socket.join(user._id.toString());
    
    socket.on('disconnect', () =>{
        // xóa user
        onlineUsers.delete(user._id);
        // cập nhật lại danh sách user
        io.emit("online-users", Array.from(onlineUsers.keys()))
        console.log(`socket disconnect : ${socket.id}`);
    })
})

export {io, app, server}