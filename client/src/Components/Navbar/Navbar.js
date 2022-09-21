import React,{useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import MemoryIcon from '@mui/icons-material/Memory';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange,purple } from '@mui/material/colors';
import { useNavigate,useLocation  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../../features/authSlice';
import Tooltip from '@mui/material/Tooltip';
import decode from "jwt-decode"

export default function ButtonAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const profile = JSON.parse(localStorage.getItem("profile"));
  
  

  const handleButtonClick = ()=>{
    if(profile?.user || profile?.profileObj){
      dispatch(logOut())
      navigate("/")
    }else{
      navigate("/auth")
    }
  }


//checking if the token is still valid and logging out the user if it is invalid
useEffect(()=>{
  if(profile?.user){
    const decodedToken = decode(profile?.token);
    if(decodedToken.exp * 1000 < new Date().getTime()) handleButtonClick();
  }

},[location])
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MemoryIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Memory Bank
          </Typography>

          <Stack sx={{alignItems:"center"}}  direction="row" spacing={2}>
           
            {profile?.user && 

              <Tooltip title={`${profile?.user?.firstName} ${profile?.user?.lastName}`}>
                <IconButton>
                <Avatar sx={{ bgcolor: deepOrange[500] }}>{profile?.user?.firstName.charAt(0)}</Avatar>
                </IconButton>
              </Tooltip>


          
            
            }
             


            {profile?.profileObj && 

              <Tooltip title={profile?.profileObj?.name}>
                <IconButton>
                  <Avatar sx={{ bgcolor: purple[500] }}>{profile?.profileObj?.givenName.charAt(0)}</Avatar>
                </IconButton>
              </Tooltip>
            }

            <Button color="inherit" onClick={handleButtonClick}>{profile?"Logout":"Login"}</Button>

            
          </Stack>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}
