import React,{useState,useEffect} from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useParams } from 'react-router-dom';
import {startPostLoading,stopPostLoading,get_post,add_new_comment} from "../features/postsSlice"
import {getPost,Comment} from "../Actions/posts"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { getCurrentTime,compareTime } from '../time';
import { v4 as uuidv4 } from 'uuid';

import {useDispatch,useSelector} from "react-redux";
function Comments() {
    const [comment,setComment] = useState("")
    const dispatch = useDispatch()
    const { id } = useParams();
    const post = useSelector((state)=>state.posts.post)
    const postLoading = useSelector((state)=>state.posts.loading)
    const [commentLoading,setCommentLoading] = useState(false)
    const [invalidId,setInvalidId]=useState(false)
    let creatorName = "";

    const profile = JSON.parse(localStorage.getItem("profile"));
    
    //if we have a user who logged in with google oAuth
     if(profile?.profileObj?.name){
       creatorName = profile?.profileObj?.name;
     }
   
     //if we have a user who logged in normally
     if(profile?.user?.firstName){
       creatorName =`${profile?.user?.firstName} ${profile?.user?.lastName} `;
     }

    

    //fetch post everytime page reloads and id changes
  useEffect(()=>{
    const getThisPost = async()=>{
      dispatch(startPostLoading())
      const postResponse = await getPost(id)
      if(postResponse){
        dispatch(get_post(postResponse))
      }else{
        setInvalidId(true)
      }
      dispatch(stopPostLoading())
    }
    getThisPost()
},[id,dispatch])
  const handleCommentSubmit = async ()=>{
      if(comment.length > 0){
        setCommentLoading(true)
        const newComment = await Comment(id,{comment:comment,creator:creatorName,createdAt:getCurrentTime()})
        dispatch(add_new_comment(newComment))
        setComment("")
        setCommentLoading(false)
      }
      
  }

if(!postLoading && !post && invalidId) return (
  <Typography sx={{textAlign:"center"}} variant="h4" gutterBottom>
    The server couldn't find the comments of the post with the id in the url,it might be an error i don't know about or you edited the url,please let me know.
  </Typography>
    
)


  return (
    <>
    {!postLoading ?
    <Container maxWidth="sm" sx={{marginTop:4}}>
         
        <Card elevation={3} sx={{ minWidth: 275,marginY:3 }}>
           {creatorName.length > 0?
            <>
            <CardContent>
                <TextField
                onChange={(e)=>{setComment(e.target.value)}}
                value = {comment}
                id="outlined-multiline-static"
                label="enter your comment"
                multiline
                fullWidth
                />
                
            </CardContent>
            <CardActions>
                <Button onClick={handleCommentSubmit} sx={{marginLeft:1}}size="small">Add your Comment</Button>
            </CardActions>
            </>: <Typography sx={{textAlign:"center"}} variant="subtitle2" gutterBottom>You need to login if you would like to leave your comment on this post</Typography>

             }


            {commentLoading && 
            <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
            <CircularProgress sx={{textAlign:"center"}} color="success" size={60} />
            </Box>
             }
        </Card>
        <Typography sx={{textAlign:"center"}} variant="subtitle2" gutterBottom>
         Comments...
       </Typography>


    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          
          {post?.comments.map((c,i)=>{

          return(
            
          <ListItem key={uuidv4()} alignItems="flex-start">
            <ListItemAvatar>
              
              <Avatar>{c.creator.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={c.creator}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'block' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {c.comment}

                  </Typography>

                  <Typography
                    sx={{ display: 'inline'}}
                    component="span"
                    variant="caption"
                    color="text.primary"
                  >
                    .{compareTime(c.createdAt,getCurrentTime())}
                    
                  </Typography>
                  
                </React.Fragment>
              }
            />
          </ListItem>
          
        
          )
          
          
          })}
      


     
    </List>
    
         
      
    </Container>
    :<Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
    <CircularProgress sx={{textAlign:"center"}} color="success" size={60} />
    </Box>
    }
    </>
    
  )



}

export default Comments;