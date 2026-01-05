import { useEffect, useState } from 'react'

import './App.css'
import { Routes, Route, useNavigate } from 'react-router'
import { LoginComponent } from './components/login'
import { RegisterComponent } from './components/register'
import { MainSocialMedia } from './components/socialMedia'

function App() {
  const navigate = useNavigate();

  const validUser = useCallback(async () => {
    const login = await fetch('https://apisocialmedia-oesl.onrender.com/v1/social/validToken', {
      method: "get",
      credentials: 'include',
      headers: {
        "Content-Type": "Application/json"
      }
    }).then((res) => res.json());
    console.log(login, "app")
    login === "Unauthorized" ? navigate('/login') : navigate('/SocialMedia');
    //setLogin(true)
  }, [])

  useEffect(() => {
    validUser();
    //localStorage.clear();
    //const token = localStorage.getItem('tokenSocial');
    //token != null? navigate('/SocialMedia'):navigate('/login')
  }, [])

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/register' element={<RegisterComponent />} />
        <Route path='/SocialMedia' element={<MainSocialMedia />} />
      </Routes>
    </>
  )
}

export default App
