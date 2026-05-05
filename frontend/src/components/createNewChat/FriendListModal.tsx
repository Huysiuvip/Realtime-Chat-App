import { useFriendStore } from '@/stores/useFriendStore'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MessageCircleMore, User } from 'lucide-react';
import { Card } from '../ui/card';
import UserAvatar from '../chat/UserAvatar';
import { useChatStore } from '@/stores/useChatStore';


const FriendListModal = () => {
    const {friends} = useFriendStore();
    const {createConversation} = useChatStore();

    const handleAllConverSation = async (friendId : string) =>{
        await createConversation('direct', '', [friendId])
    }
    
  return (
    <DialogContent className='glass max-w-md'>
        <DialogHeader>
            <DialogTitle className='flex gap-2  items-center text-xl capitalize'>
                <MessageCircleMore className='size-5'/>
                Bắt đầu hội thoại mới
            </DialogTitle>
        </DialogHeader>

        {/* friend list */}
        <div className='space-y-4'>
            <h1 className='text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide'>Danh sách bạn bè</h1>
            <div className='space-y-2 max-h-60 overflow-y-auto'>
                {friends.length === 0 && (
                      <div className='text-center py-8 text-muted-foreground'>
                <User className='size-12 mx-auto mb-3 opacity-50'/>
                Bro chưa có bạn nào cả Bro -_-???
            </div>
                ) }
                {friends.map((friends) =>(
                    <Card key={friends._id}
                          onClick={() => handleAllConverSation(friends._id)}
                          className='p-3 cursor-pointer transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard'
                    >
                       <div className='flex items-center gap-3'>
                        {/* avatar */}
                            <div className='relative'>
                                <UserAvatar type="sidebar" name={friends.displayName}
                                avatarUrl={friends.avatarUrl}/>
                            </div>
                            {/* info */}
                            <div className='flex-1 min-w-0 flex flex-col'>
                                <h2 className='font-semibold text-sm truncate'>{friends.displayName}</h2>
                                <span className='text-sm text-muted-foreground'>@{friends.userName}</span>

                            </div>
                         </div>
                    </Card>


                ))}
            </div>
        </div>

    </DialogContent>
  )
}

export default FriendListModal