import { useEffect, useState } from 'react'

import './App.css'
import { Routes, Route, useNavigate } from 'react-router'
import { LoginComponent } from './components/login'
import { RegisterComponent } from './components/register'
import { MainSocialMedia } from './components/socialMedia'

function App() {
  const navigate = useNavigate();

  useEffect(() =>{
    //localStorage.clear();
    const token = localStorage.getItem('tokenSocial');
    token != null? navigate('/SocialMedia'):navigate('/login')
  },[])

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginComponent />}/>
        <Route path='/register' element={<RegisterComponent />}/>
        <Route path='/SocialMedia' element={<MainSocialMedia />}/>
      </Routes>
    </>
  )
}

export default App
