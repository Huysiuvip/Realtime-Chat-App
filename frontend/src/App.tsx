
import {BrowserRouter, Route, Routes} from 'react-router'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ChatApp } from './pages/ChatApp'
import {Toaster} from 'sonner'
function App() {


  return (
    <>
    <Toaster richColors/>
    <BrowserRouter>
      <Routes>
        {/* {public routes} */}  
        <Route  
          path='signin'
          element={<SignInPage/>}
        />
        <Route  
          path='signup'
          element={<SignUpPage/>}
        />

        {/* {protected routes} */}
         <Route  
          path='/'
          element={<ChatApp/>}
        /> 
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
