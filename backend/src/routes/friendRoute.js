import express, { Router } from 'express'
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getAllFriend, getFriendRequests } from '../controllers/friendController.js';

const router = express.Router();

router.post('/requests', sendFriendRequest);
router.post('/request/:requestId/accept', acceptFriendRequest);
router.post('/request/:requestId/decline', declineFriendRequest);

router.get('/',getAllFriend);
router.get('/request',getFriendRequests);


export default router;
