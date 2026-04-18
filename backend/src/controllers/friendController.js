import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest  from "../models/FriendRequest.js";


export const sendFriendRequest = async (req, res) =>{
    try {
        const {to, message} = req.body;

        const from = req.user._id;

        if(from === to){
            return res.status(400).json({message:"KHông thể gủi lời mời kêt bạn cho chính mình"})
        }


        // Kiểm tra user có trong hệ thống không
        const userExists  = await User.exists({_id: to});

        if(!userExists){
            return res.status(404).json({message:"User không tồn tại!"})
        }

        let UserA = from.toString();
        let UserB = to.toString();
        if(UserA >UserB){
            [UserA, UserB] = [UserB, UserA];
        }

        // query cùng lúc kiểm tra đã là bạn bè chưa và đã gửi lời mời chưa
        const [alreadyFriend, existingRequest] = await Promise.all([
            Friend.findOne({UserA, UserB}),
            FriendRequest.findOne({
                $or:[
                    {from, to},
                    {from : to, to: from}
                ]
            }
            )
        ])

        if(alreadyFriend){
            return res.status(400).json({message:"Hai người đã là bạn bè"});
        }

        if(existingRequest){
            return res.status(400).json({message:"Đã có lời mời kết bạn"})
        }

        const request = await FriendRequest.create({
            from,
            to,
            message,
        });

        return res.status(201).json({message:"Gửi lời mời kết bạn thành công"}, request);
   
    } catch (error) {
        console.log("Lỗi khi gửi kết bạn",error);
        return res.status(500).json({message:"Lỗi hệ thống"})
        
    }
}

export const acceptFriendRequest = async (req, res) =>{
    try {

        const {requestId} =  req.params;
        const UserId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if(!request){
            return res.status(404).json({message:"Không tìm thấy lời mời kết bạn!"})
        }

        // chỉ cho phép người nhận request mới được chấp nhận
        if(request.to.toString() !== UserId.toString()){
            return res.status(403).json({message:"Bạn không có quyền chấp nhận lời mời này!"})
        }
        
        // tạo quan hệ mới
        const friend = await Friend.create({
            userA: request.from,
            userB: request.to
        });

        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select('_id displayName avatarUrl').lean();
        
        return res.status(200).json({
            message: "Chấp nhận lời mời kết bạn thành công",
            newFriend: {
                _id : from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl
            }

        })
        
    } catch (error) {
        console.log("Lỗi khi chấp nhận lời mời kết bạn",error);
        return res.status(500).json({message:"Lỗi hệ thống"})
        
    }
}

export const declineFriendRequest = async (req, res) =>{
    try {
        const {requestId} = req.params; // lấy id từ lời mời kết bạn
        const UserId = req.user._id ; // id người gửi

        const request = await FriendRequest.findById(requestId);

        if(!request){
            return res.status(404).json({message:"không tìm thây lời mời kết bạn"})
        }
        
        if(request.to.toString() !== UserId.toString()){
            return res.status(403).json({message: "Bạn không có quyền từ chối lời mời này"})
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(204);

        
    } catch (error) {
        console.log("Lỗi khi từ chối lời mời kết bạn",error);
        return res.status(500).json({message:"Lỗi hệ thống"})
        
    }
}

export const getAllFriend = async (req, res) =>{
    try {
        const userId = req.user._id;

        const friendships = await Friend.find({
            $or:[
                {
                    userA : userId,
                },
                {
                    userB: userId,
                }
            ]
        })
        .populate("userA", "_id displayName avatarUrl")
        .populate("userB", "_id displayName avatarUrl")
        .lean();

        if(!friendships.length){
            return res.status(200).json({friends:[]})
        }

        const friends  = friendships.map((f) =>
        f.userA._id.toString() === userId.toString() ? f.userB : f.userA
    )

    return res.status(200).json({friends})
    } catch (error) {
        console.log("Lỗi khi lấy danh sách bạn bè ",error);
        return res.status(500).json({message:"Lỗi hệ thống"})
        
    }
}

export const getFriendRequests = async (req, res) =>{
    try {
        const userId = req.user._id;
        const populateFriends = '_id userName displayName avatarUrl';

        const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate("to", populateFriends),
            FriendRequest.find({ to: userId }).populate("from", populateFriends)
        ])
        return res.status(200).json({sent, received})
        
    } catch (error) {
        console.log("Lỗi khi lấy danh sách yêu cầu kết bạn bạn bè ",error);
        return res.status(500).json({message:"Lỗi hệ thống"})
        
    }
}