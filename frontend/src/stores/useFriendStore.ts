import friendService from "@/services/friendService";
import type { FriendState } from "@/types/store";
import {create} from 'zustand';


export const useFriendStore = create <FriendState>((set,get) =>({

    loading : false,
    searchByUserName : async (userName ) =>{
        try {
            set({loading : true});
            
            const user = await friendService.searchByUserName(userName);
            console.log(user)
            return user;
        } catch (error) {
            console.error("Lỗi xảy ra khi tìm user bằng userName", error)
            return null;
        }finally{  
            set({loading: false})
        }
    },

    addFriend : async (to, message)  =>{
        try {
            set({loading : true});
            const resultMessage = await friendService.sendFriendRequest(to, message);

            return resultMessage;
        } catch (error) {
            console.error("Lỗi xảy ra khi add Friend");
            return "Lỗi xảy ra khi gửi kết bạn! Hãy thử lại!!!";
        }finally{
            set({loading: false})
        }
    }
}))