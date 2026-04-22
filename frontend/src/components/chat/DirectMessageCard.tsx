import type { Conversation } from '@/types/chat'
import React from 'react'
import ChatCard from './ChatCard'
import { useAuthStore } from '@/stores/useAuthStores'
import { useChatStore } from '@/stores/useChatStore'
import { cn } from '@/lib/utils'

const DirectMessageCard = ({convo} : {convo : Conversation}) => {
    // lấy thông tin từ store
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, message} = useChatStore();

    if(!user) return null;

    const otherUser = convo.participants.find((p) => p._id !== user._id);

    if(!otherUser) return null;

    const unreadCount = convo.unreadCounts[user._id];
    const lassMessage = convo.lastMessage?.content ?? "";

    const handleSelectConversation = async (id :string) =>{
        setActiveConversation(id);
        if(!message[id]){
            // todo: fetch message
        }
    }


  return  <ChatCard 
  convoId={convo._id}
  name={otherUser.displayName ?? ''}
  timestamp={
    convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined
  }
  isActive={activeConversationId === convo._id}
  onSelect={handleSelectConversation}
  unreadCount={unreadCount}
  leftSection = {
    <>
    {/*todo: user avatar  */}
    {/*todo: status badge  */}
    {/*todo: unread count  */}
    </>
  }
  subtitle={
    <p className={cn('text-sm truncate', unreadCount>0 ? 'font-medium text-foreground' : 'text-muted-foreground')}>
    </p>
  }
  
  />
}

export default DirectMessageCard