import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) =>({
            conversations : [],
            message :{},
            activeConversationId : null,
            loading: false,

            setActiveConversation : (id) => set({activeConversationId: id}),

            reset : () =>({
                conversations : [],
                message :{},
                activeConversationId : null,
                loading: false,
            }),

            fetchConversations : async () =>{
                try {
                    set({loading : true}); // đang tải dữ liệu
                    const {conversations} = await chatService.fetchConversation()

                    set({conversations, loading : false})
                } catch (error) {
                    console.error("Lỗi xảy ra khi fetchConversation ", error);
                    set({loading : false})
                    
                }
            }
        }),
        {
        name: "chat-storage",
        partialize : (state) =>({conversations : state.conversations})
    }
    )
    
)