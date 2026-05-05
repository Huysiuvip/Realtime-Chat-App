import friendService from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from 'zustand';


export const useFriendStore = create<FriendState>((set, get) => ({
    friends: [],
    loading: false,
    receivedList: [],
    sentList: [],
    searchByUserName: async (userName) => {
        try {
            set({ loading: true });

            const user = await friendService.searchByUserName(userName);
            return user;
        } catch (error) {
            console.error("Lỗi xảy ra khi tìm user bằng userName", error)
            return null;
        } finally {
            set({ loading: false })
        }
    },

    addFriend: async (to, message) => {
        try {
            set({ loading: true });
            const resultMessage = await friendService.sendFriendRequest(to, message);

            return resultMessage;
        } catch (error) {
            console.error("Lỗi xảy ra khi add Friend");
            return "Lỗi xảy ra khi gửi kết bạn! Hãy thử lại!!!";
        } finally {
            set({ loading: false })
        }
    },

    getAllFriendRequests: async () => {
        try {
            set({ loading: true });
            const result = await friendService.getAllFriendRequest();
            if (!result) return;

            const { received, sent } = result;

            set({ receivedList: received, sentList: sent })
        } catch (error) {
            console.log("Lỗi xảy ra khi getAllFriendRequest")
        } finally {
            set({ loading: false })
        }
    },

    acceptRequest: async (requestId) => {
        try {
            set({ loading: true });
            await friendService.acceptRequest(requestId);
            // nếu thành công cập nhật nhật store xóa các yêu cầu

            set((state) => ({
                receivedList: state.receivedList.filter((r) => r._id !== requestId),
            }))
        } catch (error) {
            console.error("Lỗi khi acceptRequests");
        } finally {
            set({ loading: false })
        }
    },

    declineRequest: async (requestId) => {
        try {
            set({ loading: true });
            await friendService.declineRequest(requestId);
            // nếu thành công cập nhật nhật store xóa các yêu cầu

            set((state) => ({
                receivedList: state.receivedList.filter((r) => r._id !== requestId),
            }))
        } catch (error) {
            console.error("Lỗi khi declineRequest");
        } finally {
            set({ loading: false })
        }
    },

    getFriends: async () => {
        try {
            set({ loading: true })
            const friends = await friendService.getFriendList();
            set({ friends: friends })

        } catch (error) {
            console.log("Lỗi khi getFriends")
            set({friends : []})
        } finally {
            set({ loading: false })
        }
    }
}))