import Logout from "../components/auth/logout"
import { useAuthStore } from "../stores/useAuthStores"


export const ChatApp = () => {
  const user = useAuthStore((s) => s.user); // lay  dung truong trong store
  
  return (
    
    
    <div>{user?.userName} <Logout/>
     
    </div>
    
  )
}
