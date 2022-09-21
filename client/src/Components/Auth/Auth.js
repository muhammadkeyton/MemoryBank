import React,{useState,useEffect} from 'react'

import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import GoogleIcon from '@mui/icons-material/Google';
import Fab from '@mui/material/Fab';

import Divider from '@mui/material/Divider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import Grid from '@mui/material/Grid';

import {submitSignUpData,submitLoginData} from "../../Actions/auth"

import {useDispatch,useSelector} from "react-redux";
import { login, sign_Up } from "../../features/authSlice";

import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { startLoading,stopLoading } from '../../features/loadingSlice';

import {useNavigate} from "react-router-dom";
import GoogleLogin from 'react-google-login';
import {gapi} from "gapi-script";
import {submitGoogleData} from "../../Actions/auth"
import { google_oAuth} from "../../features/authSlice"
import {clearError} from "../../features/authSlice"


function Auth() {

  const dispatch = useDispatch();

  
  const navigate = useNavigate();
  const [signUp,setSignUp] = useState(false)
  const [showPassword,setShowPassword] = useState(false)

  const errorMessage = useSelector((state)=> state.auth.value);
  const loading = useSelector((state)=> state.loading.value);
  
  const [credentialData,setCredentialData] = useState({
    firstName:"",
    lastName:"",
    emailAddress:"",
    password:"",
    repeatPassword:""
})

  const handleDataChange = (e)=>{
    const {name,value} = e.target;
    setCredentialData({...credentialData,[name]:value});
  }


  const handleSignUpLoginClick = ()=> {
    setSignUp(!signUp)
    dispatch(sign_Up(""))
    setCredentialData({
      firstName:"",
      lastName:"",
      emailAddress:"",
      password:"",
      repeatPassword:""
    })
  }
  const handleShowPassword = ()=> setShowPassword(!showPassword)

 
  const handleCredentialSubmit = async ()=>{

    
    if(signUp){
        //starts loading state after signup data is sent and wait for server response
        dispatch(startLoading());
        const signUpResponse = await submitSignUpData(credentialData,navigate)
        dispatch(sign_Up(signUpResponse));

        //stops loading when we receive back an error or user info
        dispatch(stopLoading())

        //clearing the auth error if user successfully logs in
        if(typeof(signUpResponse) === "object"){
          dispatch(clearError())
          
        }
        
    }else{
        dispatch(startLoading());
        const loginResponse = await submitLoginData(credentialData,navigate)
        dispatch(login(loginResponse));
        dispatch(stopLoading())

        //clearing the auth error if user successfully logs in
        if(typeof(loginResponse) === "object"){
          dispatch(clearError())
          
        }

        
    }
    
  }
  

  //-------------------------google login---------------------------------------------------------
  
  //for the google authentication
  useEffect(()=>{
    const start = ()=>{
      gapi.client.init({
        clientId:process.env.react_app_google_client_id,
        scope:"profile"
      })
    }


    gapi.load("client:auth2",start)
  })
  
  
  const responseGoogle = async (response) => {
    dispatch(startLoading());
    const {profileObj,accessToken:token} = response;
    const proceed = await submitGoogleData(profileObj,navigate)
    if(proceed) dispatch(google_oAuth({profileObj,token}))
    dispatch(stopLoading())
    //clearing the auth error if user successfully logs in
    dispatch(clearError())
    
  }
    
  
  return (
    <Container maxWidth="sm">
         
         <Paper sx={{marginY:5,paddingY:3}} elevation={3}>
             <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
              <LockIcon fontSize="large" sx={{backgroundColor:"#FF0063",color:"#fff",borderRadius:"50px",padding:1,marginBottom:2}} />
              <Typography sx={{textAlign:"center",marginX:1}}  variant="h5"  gutterBottom>{signUp?"Sign up with credentials":"Login with credentials"} </Typography>
             </Box>
             

             <Container>
                {errorMessage?
                  <Typography sx={{color:"red"}} variant="body2" gutterBottom>
                     Hey {credentialData.firstName?credentialData.firstName:"there"},{errorMessage}
                  </Typography>
                  :
                  <Typography sx={{color:"green"}} variant="body2" gutterBottom>
                     Hello {signUp?`${credentialData.firstName || 'stranger'},welcome to memory bank`:"user,welcome back!"}
                  </Typography>
                  
                }

                {signUp && <Grid container spacing={1}>
                    <Grid item xs={6}>
                    <TextField value={credentialData.firstName} onChange={handleDataChange} name="firstName" sx={{marginY:1}} fullWidth id="outlined-basic" label="First Name*" variant="outlined" /> 
                    </Grid>

                    <Grid item xs={6}>
                    <TextField value={credentialData.lastName} onChange={handleDataChange} name="lastName" sx={{marginY:1}} fullWidth   label="Last Name*" variant="outlined" />
                    </Grid>
                </Grid>
                }
                <TextField value={credentialData.emailAddress} onChange={handleDataChange} name="emailAddress" sx={{marginY:2}} fullWidth id="outlined-basic" label="Email Address*" variant="outlined" />

                <Box sx={{display:"flex",position:"relative"}}>
                    <TextField value={credentialData.password} onChange={handleDataChange} name="password" sx={{marginBottom:2}} fullWidth  id="outlined-password-input" type={showPassword?"text":"password"}  label="Password*" variant="outlined" />
                    
                    <IconButton onClick={handleShowPassword} sx={{position:"absolute",right:6,bottom:24}}>
                    {showPassword?<VisibilityIcon/>:<VisibilityOffIcon />}
                    </IconButton>     
                </Box>
                {signUp && 
                
                    <Box sx={{display:"flex",position:"relative"}}>
                        <TextField value={credentialData.repeatPassword} onChange={handleDataChange} name="repeatPassword" sx={{marginBottom:2}} fullWidth  id="outlined-password-input" type={showPassword?"text":"password"} label="Repeat Password*" variant="outlined" />
                        
                        <IconButton onClick={handleShowPassword} sx={{position:"absolute",right:6,bottom:24}}>
                        {showPassword?<VisibilityIcon/>:<VisibilityOffIcon />}
                        </IconButton>     
                    </Box>
                
                
                }
                <Button onClick={handleCredentialSubmit} fullWidth variant="contained">{signUp?"Sign Up":"Login"}
                
                
                
                
                </Button>


                {loading &&  
                 
                 
                 <Backdrop
                   sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                   open={loading}
                   
                 >
                   <CircularProgress color="inherit" />
                 </Backdrop>
                           
                
                
                
                
                }

    
                 
                
                
                
                <Divider sx={{marginY:3}}>OR</Divider>

                
                <Box sx={{display:'flex',flexDirection:"column",alignItems:"center",marginBottom:2}}>
                    
                      <GoogleLogin
                          clientId={process.env.react_app_google_client_id}
                          render={renderProps => (
                            
                            <Fab onClick={renderProps.onClick} disabled={renderProps.disabled} color="error">
                            <GoogleIcon/>+   
                            </Fab>


                          )}
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                          cookiePolicy={'single_host_origin'}
                      />


                      
                </Box>

                
                
                
                
               
               
             </Container>
         </Paper>

         <Button sx={{marginBottom:3}} onClick={handleSignUpLoginClick} fullWidth variant="contained" color="success">{signUp?"Have an account? Log In":"No account? Sign Up Now"}</Button>
         
      


    </Container>
  )
}

export default Auth;