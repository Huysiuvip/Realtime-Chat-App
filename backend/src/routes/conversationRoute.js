import express from 'express'
import { createConversation, getConversations, getMessages, markAsSeen } from '../controllers/conversationController.js';
import { checkFriendship } from '../middlewares/friendMiddleware.js';

const route = express.Router();


route.post("/",checkFriendship , createConversation);
route.get("/", getConversations);
route.get("/:conversationId/messages", getMessages);
route.patch("/:conversationId/seen", markAsSeen)

export default route;