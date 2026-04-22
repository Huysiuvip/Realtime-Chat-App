
import {BrowserRouter, Route, Routes} from 'react-router'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ChatApp } from './pages/ChatApp'
import {Toaster} from 'sonner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useThemeStore } from './stores/useThemeStore'
import { useEffect } from 'react'
function App() {
  const {isDark, setTheme} = useThemeStore();

  useEffect(() =>{
    setTheme(isDark)
  }, [isDark])


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
        <Route element={<ProtectedRoute/>} >
           <Route  
            path='/'
            element={<ChatApp/>}
          /> 
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
