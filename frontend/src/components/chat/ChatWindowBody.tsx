import { useChatStore } from "@/stores/useChatStore"
import ChatWellComeScreen from "./ChatWellComeScreen";
import MessageItems from "./MessageItems";
import { useEffect, useState } from "react";




const ChatWindowBody = () => {
  const {activeConversationId, conversations, messages:allMessage} = useChatStore();

  const [lastMessageStatus,setLastMessageStatus] = useState<'delivered' | 'seen'>("delivered");

  const messages = allMessage[activeConversationId!]?.items  ?? [];
  

  const selectedConvo = conversations.find((c) => c._id === activeConversationId)

  useEffect(() =>{
    const lastMessage = selectedConvo?.lastMessage;
    if(!lastMessage){
      return
    }
    const seenBy = selectedConvo?.seenBy ?? [];


    setLastMessageStatus(seenBy.length > 0 ? 'seen' : 'delivered')
  })

  if(!selectedConvo){
    return <ChatWellComeScreen/>
  }

  if(!messages?.length){
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">Chưa có tin nhắn nào trong cuộc trò chuyện này</div>
    )
  };

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
          {messages.map((message, index) =>(
            <MessageItems 
            key={message._id ?? index } 
            message={message} 
            index={index} 
            messages={messages} 
            selectedConvo={selectedConvo} lastMessageStatus={lastMessageStatus}/>
          ))}
      </div>

    </div>
  )
}

export default ChatWindowBody