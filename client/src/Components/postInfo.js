import React, { useEffect,useState} from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useSelector,useDispatch} from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';
import {startPostLoading,stopPostLoading,get_post,like_Post} from "../features/postsSlice"
import {getPost,likePost} from "../Actions/posts"
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ButtonBase from '@mui/material/ButtonBase';

import Divider from '@mui/material/Divider';

import {getPostsBySearch} from "../Actions/posts"
import {get_posts_by_search} from "../features/postsSlice"

import { compareTime,getCurrentTime } from '../time';
import {useNavigate} from "react-router-dom";



function PostInfo() {
 const navigate = useNavigate()
 const dispatch = useDispatch()
 const postLoading = useSelector((state)=>state.posts.loading)
 const post = useSelector((state)=>state.posts.post)
 const posts = useSelector((state)=>state.posts.value)

 const profile = JSON.parse(localStorage.getItem("profile"));

  

 let userId = profile?.user?._id || profile?.profileObj?.googleId;


 const { id } = useParams();

 const [invalidId,setInvalidId]=useState(false)

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

 useEffect(()=>{
  
  const getRecommendedPosts = async ()=>{
    if(post){
      dispatch(startPostLoading())
      const posts = await getPostsBySearch({search:"none",tags:post?.tags.join(",")})
      dispatch(get_posts_by_search(posts))
      dispatch(stopPostLoading())
    }

  }

  getRecommendedPosts()
  
},[post,dispatch])


const recommendedPosts = posts?.filter((p)=>p._id !== post?._id)

 const handleLikePost = ()=>{
  likePost(post._id)
  
  //the inpost included here just informs the postslice that we have opened this post
  dispatch(like_Post({post,userId,inPost:true}))
  
   
  
}



const handleOpenRecommendedPosts = (id)=>{
  navigate(`/post/${id}`)
}

const handleComment = (id)=>{
  navigate(`/post/${id}/comments`)
}

const Likes = () => {
  if (post?.likes?.length > 0) {
    return post?.likes?.find((like) => like === (userId))
      ? (
        <><FavoriteIcon  sx={{ color:"red" }}/><Typography  variant="h6">&nbsp;{post?.likes?.length > 2 ? `You and ${post?.likes?.length - 1} others` : `${post?.likes?.length} Like${post?.likes?.length > 1 ? 's' : ''}` }</Typography></>
      ) : (
        <><FavoriteIcon/><Typography variant="h6">&nbsp;{post?.likes?.length} {post?.likes?.length === 1 ? 'Like' : 'Likes'}</Typography></>
      );
  }

  return <FavoriteIcon/>;
};



 if(!postLoading && !post && invalidId) return (
  <Typography sx={{textAlign:"center"}} variant="h4" gutterBottom>
         The server couldn't find the post with the id in the url,it might be an error i don't know about or you edited the url,please let me know.
  </Typography>


    
 )
  return (
    <>
      {postLoading? 
      
      <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
          <CircularProgress sx={{textAlign:"center"}} color="success" size={60} />
      </Box>
        
        :

      <Grid container spacing={2} marginBottom={6}>
          <Grid item xs={12} sm={12} md={6} lg={6} order={{ xs: 2, sm: 2 ,md:1,lg:1}}>
              <Box sx={{padding:2}}>
               

                <Typography variant="h4" gutterBottom>
                  {post?.title}
                </Typography>

                <Typography variant="caption" gutterBottom>
                    {post?.tags.map((tag)=>{return `#${tag} `})}
                </Typography>

                <Typography marginTop={1} variant="subtitle1" gutterBottom>
                  {post?.message}
                </Typography>

                <Typography sx={{color:"green"}}variant="h6" gutterBottom>
                  Posted By: {post?.creatorName}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  Posted: {compareTime(post?.createdAt,getCurrentTime())}
                </Typography>

              </Box>

              <Box sx={{padding:2,display:'flex',justifyContent:"space-between"}}>
                <IconButton disabled={!userId} onClick={handleLikePost}><Likes/></IconButton>
                <IconButton onClick={()=>{handleComment(id)}}><CommentIcon/>&nbsp;{post?.comments.length}</IconButton>
              
              </Box>

          </Grid>
            
          <Grid item xs={12} sm={12} md={6} lg={6} order={{ xs: 1, sm: 1 ,md:2,lg:2}}>
                <Box sx={{
                  backgroundImage:`url(${post?.selectedFile})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize:"cover",
                  height: "500px",
                  width: '100%'}}>
                </Box>
          </Grid>
      </Grid>
      
      

      }


      <Divider />
{/* ---------------------------recommended posts section----------------------------------------------- */}
{(recommendedPosts.length > 0) && <Typography paddingX={2} sx={{textAlign:"left"}} variant="h4" gutterBottom>Recommended posts:</Typography>}

{recommendedPosts.length > 0 &&

<Box marginX={2} paddingY={2}>
<Grid container spacing={3}>
    {recommendedPosts.map((p,i)=>{
        return(
                <Grid key={i} item xs={12} sm={4} lg={3}>
                   <ButtonBase onClick={()=>{handleOpenRecommendedPosts(p._id)}} sx={{textAlign:"left"}}>
                    <Card elevation={4} sx={{ maxWidth: 300 }}>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {p?.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {p?.tags.map((tag)=>{return `#${tag} `})}
                        </Typography>
                        <Typography variant="body2">
                        {p?.message.substring(0,30) + " ..."}
                        </Typography>
                      </CardContent>
                    </Card>
                    </ButtonBase>
                </Grid>
        )
    })}
  
</Grid>
</Box>
} 

   

</>
)
}

export default PostInfo