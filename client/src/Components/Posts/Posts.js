import React from 'react'
import Post from "./Post/Post"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { v4 as uuidv4 } from 'uuid';

import {useSelector} from "react-redux";
import Typography from '@mui/material/Typography';

function Posts() {
  const posts = useSelector((state)=>state.posts.value)
  const postLoading = useSelector((state)=>state.posts.loading)
  

  if(postLoading) {
    return <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}><CircularProgress  size={65}/></Box>
  }

  

  return (
    <>  
       {posts?.length?
    
        <Box sx={{
            paddingY:4,
            paddingX:3
        }}>
          <Grid container spacing={3}>
            {posts.map((post)=>{
              return <Post key={uuidv4()} post={post}/>
            })}
            
           
          </Grid>
          
        </Box>

        :

        <Box sx={{paddingX:3,paddingY:3}}>
          <Typography variant="h6" gutterBottom>
            sorry I couldn't find any posts matching the search criteria you provided😞
          </Typography>
        </Box>


       }
        
    </>
  )
}

export default Posts