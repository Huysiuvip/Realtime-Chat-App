import { useAuthStore } from '@/stores/useAuthStores';
import { useChatStore } from '@/stores/useChatStore';
import type { Conversation } from '@/types/chat'
import React from 'react'
import ChatCard from './ChatCard';

const GroupChatCard = ({convo} : {convo : Conversation}) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, message} = useChatStore();

     if(!user) return null;

    const unreadCount = convo.unreadCounts[user._id];
    const name = convo.group?.name ?? "";

    const handleSelectConversation = async (id :string) =>{
        setActiveConversation(id);
        if(!message[id]){
            // todo: fetch message
        }
    }



    return  <ChatCard 
  convoId={convo._id}
  name={name}
  timestamp={
    convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined
  }
  isActive={activeConversationId === convo._id}
  onSelect={handleSelectConversation}
  unreadCount={unreadCount}
  leftSection = {
    <>
    {/*todo: group avatar  */}
   
    </>
  }
  subtitle={
    <p className="text-sm truncate text-muted-foreground">
        {convo.participants.length}
    </p>
  }
  
  />
}

export default GroupChatCard