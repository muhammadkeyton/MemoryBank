import React,{useState,useEffect} from 'react'
import Home from "./Components/Home/Home"
import Auth from './Components/Auth/Auth';

import { Routes, Route,Navigate } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';

import theme from "./styles";
import PostInfo from './Components/postInfo';
import Comments from './Components/comments';
function App() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const [loggedIn,setLoggedIn ]= useState(false)
  
  useEffect(()=>{
    //if we have a user who logged in with google oAuth
  if(profile?.profileObj?.name){
    setLoggedIn(true)
  }

  //if we have a user who logged in normally
  if(profile?.user?.firstName){
    setLoggedIn(true)
  }

  },[profile])
  
  
  return (
       <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Navigate to="/posts" replace={true} />}/>
            <Route path="/posts" element={<Home />} />
            <Route path="/posts/search" element={<Home />} />
            <Route path="/post/:id" element ={<PostInfo/>} />
            <Route path="/post/:id/comments" element ={<Comments/>}></Route>
            <Route path="/auth" element={loggedIn?<Navigate to="/posts" replace={true} />:<Auth />} />
          </Routes>
       </ThemeProvider>
        
  )
}

export default App