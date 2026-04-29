import { useChatStore } from "@/stores/useChatStore"
import ChatWellComeScreen from "./ChatWellComeScreen";
import MessageItems from "./MessageItems";


const ChatWindowBody = () => {
  const {activeConversationId, conversations, messages:allMessage} = useChatStore();

  console.log(allMessage)
  const messages = allMessage[activeConversationId!]?.items  ?? [];
  

  const selectedConvo = conversations.find((c) => c._id === activeConversationId)

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
            <MessageItems key={message._id ?? index } message={message} index={index} messages={messages} selectedConvo={selectedConvo} lastMessageStatus="delivered"/>
          ))}
      </div>

    </div>
  )
}

export default ChatWindowBody