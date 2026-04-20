import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/messageController.js';
import { checkFriendship, checkGroupMembership } from '../middlewares/friendMiddleware.js';


const route  = express.Router();

route.post('/direct',checkFriendship, sendDirectMessage);
route.post('/group',checkGroupMembership, sendGroupMessage);

export default route;