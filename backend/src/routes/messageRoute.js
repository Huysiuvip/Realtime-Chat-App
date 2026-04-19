import express from 'express';
import { sendDirectMessage, sendGroupMessage } from '../controllers/messageController.js';
import { checkFriendship } from '../middlewares/friendMiddleware.js';


const route  = express.Router();

route.post('/direct',checkFriendship, sendDirectMessage);
route.post('/group', sendGroupMessage);

export default route;