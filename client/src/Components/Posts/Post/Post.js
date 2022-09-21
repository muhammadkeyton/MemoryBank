import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';



import Grid from '@mui/material/Grid';

import {useDispatch,useSelector} from "react-redux";

import { deletePost,likePost } from '../../../Actions/posts';
import { delete_Post,add_Update_Post_Id,like_Post} from '../../../features/postsSlice';

import { compareTime,getCurrentTime } from '../../../time';

import { useNavigate } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';


export default function MediaCard({post}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("profile"));

  const posts = useSelector((state)=>state.posts.value)

  let userId = profile?.user?._id || profile?.profileObj?.googleId;

  
  const handleLikePost = ()=>{
    likePost(post._id)
  
    dispatch(like_Post({post,userId}))
    
     
    
  }

  const handlePostEdit = ()=>{
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    dispatch(add_Update_Post_Id(post._id))
  }


  const handleDeletePost = ()=>{
    deletePost(post._id)
    dispatch(delete_Post(post._id))

    //if user deletes all posts in the current page,redirect to home page
    if(posts.length === 1){
      navigate("/")
    }
  }

  const Likes = () => {
    if (post?.likes.length > 0) {
      return post?.likes.find((like) => like === (userId))
        ? (
          <><FavoriteIcon  sx={{ color:"red" }}/><Typography  variant="body1">&nbsp;{post?.likes.length > 2 ? `You and ${post?.likes.length - 1} others` : `${post?.likes.length} Like${post?.likes.length > 1 ? 's' : ''}` }</Typography></>
        ) : (
          <><FavoriteIcon/><Typography variant="body1">&nbsp;{post?.likes.length} {post?.likes.length === 1 ? 'Like' : 'Likes'}</Typography></>
        );
    }

    return <FavoriteIcon/>;
  };

  const handlePostDetailClick = ()=>{
    navigate(`/post/${post._id}`)
   
  }
  
  return (
    <Grid item xs={12} sm={12} md={6} lg={4}>
    
  
    <Card elevation={4} sx={{ maxWidth: 600}}>
      
      <Box sx={{
        position:'relative',
      }}>
        <CardMedia
            component="img"
            height="140"
            image={post?.selectedFile}
            alt="no post image"
        />

        <Box sx={{position:"absolute",top:0,paddingX:2,paddingY:2}}>

        
        <Typography sx={{color:"#fff"}} variant="h6" component="h2" gutterBottom >{post?.creatorName}</Typography>
        <Typography sx={{color:"#fff"}} variant="caption" display="block" gutterBottom>{compareTime(post?.createdAt,getCurrentTime())}</Typography>
        
        </Box>
        {post?.creatorId === userId && 
        <IconButton onClick={handlePostEdit} sx={{position:"absolute",right:20,top:12}}>
         <FormatListBulletedIcon color="primary" />
        </IconButton>
        }
      </Box>
    
      
    <ButtonBase onClick={handlePostDetailClick} sx={{textAlign:"left"}}>
      <CardContent>
        <Typography variant="caption" display="block" gutterBottom>
            {post?.tags.map((tag)=>{return `#${tag} `})}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {post?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post?.message.substring(0,100) + " ..... Read more"}
        </Typography>
      </CardContent>
      </ButtonBase>
      <CardActions sx={{display:'flex',justifyContent:'space-between'}}>
        <IconButton disabled={!userId} onClick={handleLikePost}><Likes/></IconButton>
        {post?.creatorId === userId && <IconButton onClick={handleDeletePost}><DeleteForeverIcon color="action"/></IconButton>}
      </CardActions>
    </Card>
    </Grid>
  );
}