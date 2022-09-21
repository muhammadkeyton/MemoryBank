import React,{useState,useEffect} from 'react'

import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



import { v4 as uuidv4 } from 'uuid';

import {useDispatch,useSelector} from "react-redux";

import {createPost,updatePost,getPostsBySearch} from "../../Actions/posts"
import {create_Post,update_Post,remove_Update_Post_Id,get_posts_by_search} from "../../features/postsSlice"

import {getCurrentTime} from "../../time"

import { startLoading,stopLoading } from '../../features/loadingSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import {useNavigate,useLocation} from "react-router-dom";

import Pagination from "../pagination"

import { storage } from '../../firebase';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"

const EmptyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEUAAAD///9bWVrm5uaqqqqgoKBPT0/z8/ORkZHg4OB1dXWzs7PU1NTr6+vv7+86OjqAfn/MzMxsbGyXl5fAwMCHh4djY2PHx8dfX1+dnZ1ISEguLi66urpVVVV3d3evr69BQUElJSUvLy8MDAwXFxes5b5hAAADzUlEQVR4nO3b23LaMBSFYQljsDEQGxtIiM2hzfs/Y6UtnEna5EITSbDo+i8am4LQF587U1UPk0duqNWgHrtBTW49hchNKISPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvyCCk/TUJ3CTSqoUIcr3KQo9MrMrHzJf9pLedfCuxpHotArClOPI1HoFYWpx5Eo9IrC1ONIFHpFYepxJAq9ojD1OBKFXlGYehyJQq8oTD2ORKFXFKYeR6LQKwpTjyNR6BWFqceRKPSKwtTjSBR6RWHqcSQKvaIw9TgShV5RmHociUKvKEw9jkShVxSmHkei0CsKU48jUegVhanHkSj0isLU40gUekVh6nEkCr0yM5seZj/tML1rYajCTYpCr7JgrcJNiv9bHT8K8aMQv9sLL23c8W8uzPUy7hfcWljrRxcutG7ifkMUYd3vq4VdeO2rWg39shvMcrVstua1Q1Ud1bYpm41Zafdar6YnVVTuA3ZhF3YyEYSvc7l3Xl+UOmtd5bJWb+SH2SPNQlXKSqfU+nqfvTVQ+bBZ+RV2OhGEBrjuM63nIpzr8iSO+Wlp/lyonV1ZCfJFlfa3sV6L7EkJvww8nfDCqTt39Fq3VqinSuZvvGpp13Zu6yn3nLu5Hofm7bn50Wm9DTyf8MK52xrKbo3z9UlvZbn2yqB7EY5v3NkzjZxLZ243Dfpk6AovtLvi8Xi0x516cttOZXb3NKcRu/WMMJM3NloX70L7Szjbvwt+Zg0uvHx8UB+F5qB7Vlfh82jq7IH4LmztHmz21U3Y6UQQ/jaybSG13wndafPzNjSfW8fYSePspW/j8gehvcqNQveGT8ehgM01owo8mxjCvZvmptn33wobt6LlnuZ6eXAXzFng2cQQ2vNnt2ntzvqlcCK3A5W9OLZyDtXLprBvktcDT0ZFueLX1/NM9dVeurfCLBvvaWRfdddMuUDmoScT5770qc/m68aSLvtODqy86+zut+u6wgpLVSyzxp01L325ymq7dHZ3bMdt2Gt++meLYbwe/l0rh+SszRdB773vRziRI1dN2vw56DXxXoRyYMoxu62LoN93E+EXZ0wBnmN8X3rh2+xw/vfVTVEEfvIdu/W/YsSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjEj0L8KMSPQvwoxI9C/CjE738QDreeQuQGVQ+TR26o/wC/TiXuOSy+6AAAAABJRU5ErkJggg=="
   
function useQuery() {
  return new URLSearchParams(useLocation().search);
}


function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTags,setSearchTags]=useState([]);
  const [searchTagText,setSearchTagText] = useState("");

  const [searchText,setSearchText] = useState("");

  //pagination
  const query = useQuery();
  const page = query.get("page") || 1;

  const [memory,setMemory] = useState({
    title:"",
    message:"",
    tags:"",
    selectedFile:EmptyImage,
  });

  const [imagePreparing,setImagePreparing] = useState(false);
  const [invalidImage,setInvalidImage]=useState(false);
  const [imageReady,setImageReady]=useState(false);

  
  const postUpdateId = useSelector((state)=>state.posts.upDateId)
  const postToUpdate = useSelector((state)=>postUpdateId?state.posts.value.find((p)=> p._id === postUpdateId):null)
  const loading = useSelector((state)=> state.loading.value);
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

//----------------------------------memory search logic------------------------
  const handleSearch = async (e)=>{
    e.preventDefault();
    if(searchText.trim().length > 0 || searchTags.length > 0){
      dispatch(startLoading())
      navigate(`/posts/search?searchQuery=${searchText}&tags=${searchTags}`)
      const posts = await getPostsBySearch({search:searchText,tags:searchTags.join(',')})
      console.log(posts)
      dispatch(get_posts_by_search(posts))
      dispatch(stopLoading())
      
    }else{
      navigate("/")
    }
    
  }
 
//------------------------------memory creation logic start-------------------------------  
  const handleMemoryChange = (e)=>{
    const {name,value} = e.target
    setMemory({...memory,[name]:value})
  }
  
  const handleImageProcessing = async(e)=>{
    if(e.target.files[0]){
      const imgType = e.target.files[0].type;
      if(imgType === "image/webp" || imgType === "image/jpeg" || imgType === "image/png" || imgType === "image/tiff" || imgType === "image/gif" ){
          setImagePreparing(true)
          setInvalidImage(false)
          const imageRef = ref(storage,uuidv4());
          uploadBytes(imageRef,e.target.files[0]).then(()=>{
            getDownloadURL(imageRef).then((url)=>{
              setMemory({...memory,selectedFile:url})
              setImagePreparing(false)
              setImageReady(true)
            }).catch(error=>{
              console.log(error.message,"error getting the image url")
            })
          }).catch(error=>{
            console.log(error.message)
          })


      }else{
        setInvalidImage(true)
      }
      

    }


  }

  const handleMemorySubmit = async ()=>{

    //if updateId exists in store then edit memory otherwise create new memory
    if(postUpdateId){
      const {tags} = memory;
      
      //if the datatype of tags is string we split it and if its object we just dispatch the way it is
      if(typeof(tags) === "object"){
        dispatch(update_Post({...memory,createdAt:getCurrentTime()}))
        updatePost({...memory,createdAt:getCurrentTime()})
      }else if(typeof(tags) === "string"){
        dispatch(update_Post({...memory,tags:tags.split(","),createdAt:getCurrentTime()}))
        updatePost({...memory,tags:tags.split(","),createdAt:getCurrentTime()})
      }
      
      dispatch(remove_Update_Post_Id())
      
    }else{
      dispatch(startLoading())
      const {tags} = memory;
      const data = await createPost({...memory,tags:tags.split(","),createdAt:getCurrentTime(),creatorName:creatorName})
      dispatch(create_Post(data))
      creatorName = "";
      dispatch(stopLoading())
    }
   
    setMemory({
      title:"",
      message:"",
      tags:"",
      selectedFile:EmptyImage,
    })
    setImageReady(false)
  }
//---------------------------------memory creation logic end----------------------------------------------

//--------------------------------memory edit logic start--------------------------------------------------

useEffect(()=>{
 if(postToUpdate) setMemory(postToUpdate)
},[postToUpdate])

//------------------------------memory edit logic end-------------------------------------------------------

  const handleClearButton = ()=>{
    setMemory({
        title:"",
        message:"",
        tags:"",
        selectedFile:EmptyImage
    })
  }

  const handleKeyDown = (e) => {

    if(e.keyCode === 13){
      setSearchTags([...searchTags,searchTagText])
      setSearchTagText("")
      
    
    }
    
  };

  const handleDeleteChip = (tag) => {
    setSearchTags(searchTags.filter((t)=> t !== tag))
  };

  return (
   
    <>   
        
        {/* search section start */}
        <Paper elevation={3} sx={{marginY:4,marginX:3,paddingY:2}}>
            <Container>
            <form >
            <TextField onChange={(e)=>setSearchText(e.target.value)} value={searchText} fullWidth id="standard-basic" label="Search Memories" variant="standard" />
            <TextField onKeyDown={handleKeyDown} fullWidth sx={{marginY:2}} id="outlined-basic" label="Search Tags(using the enter key)" variant="outlined"
             onChange={(e)=>{setSearchTagText(e.target.value)}}
             value={searchTagText}
            />
               <Grid container spacing={2}>

               
                  {searchTags.map((tag)=>
                    <Grid key={uuidv4()} item xs={6} md={4} lg={3}>
                      <Chip
                      key={uuidv4()}
                      label={tag}
                      
                      onDelete={()=>handleDeleteChip(tag)}
                      color="success" 
                      variant="outlined"
                      size="small"
                      />
                    </Grid>
                  
                  )}

               </Grid>
                

              
              

            
            <Button type="submit" onClick={handleSearch} fullWidth sx={{marginY:2}} variant="contained">Search</Button>
             
            {loading &&  
                <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
                <CircularProgress sx={{textAlign:"center"}} color="success" />
                </Box>
            }

            </form>
            
            
            </Container>
        </Paper>
        {/* search section end */}


{/* ------------------------------------------------------------------------------------ */}

        {/* create memory section start */}
    {profile?
      <Paper elevation={3} sx={{marginX:3,paddingTop:2,marginBottom:5}}>

        <Container>
          <Typography sx={{textAlign:"center"}} variant="h6" gutterBottom>
            {postToUpdate?"Edit selected memory":"Create a new memory"}
          </Typography>

          <TextField onChange={handleMemoryChange} name="title" sx={{marginBottom:2}} fullWidth id="outlined-basic" label="Title" variant="outlined" value={memory.title} />
          <TextField
            onChange={handleMemoryChange}
            value={memory.message}
            name="message"
            id="outlined-basic"
            label="Message"
            multiline
            fullWidth
            sx={{marginBottom:2}}  
          />

         <TextField onChange={handleMemoryChange} name="tags" sx={{marginBottom:2}} fullWidth id="outlined-basic" label="Tags (Coma separated)" variant="outlined" value={memory.tags} />
         
         <input type="file" onChange={handleImageProcessing}/>

         {imagePreparing && 
         <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
            <CircularProgress sx={{textAlign:"center"}} color="success" />
            <Typography variant="caption">preparing your image..this might take longer depending on image size,please be patient, i am working on it😉</Typography>
          </Box>
         }

         {invalidImage &&
          <Typography sx={{color:"red"}} variant="caption">please select images only!😥</Typography>
         }

         {imageReady &&
          <Typography sx={{color:"green"}} variant="caption">Wooho!,your image is ready to be uploaded😄</Typography>
         }

         
         {/* <FileBase  hidden type='file' multiple={false} onDone={({base64})=>setMemory({...memory,selectedFile:base64})} /> */}
         <Button onClick={handleMemorySubmit} disabled={imagePreparing} sx={{marginBottom:2,marginTop:2}} fullWidth color="success"  variant="contained">Submit Memory</Button>
         <Button onClick={handleClearButton} sx={{marginBottom:2}} fullWidth color="error"  variant="outlined">Clear Memory</Button>
         

         
        </Container>

        {loading &&  
         <Box sx={{display:'flex',flexDirection:"column",alignItems:"center"}}>
         <CircularProgress sx={{textAlign:"center"}} color="success" />
         </Box>
        
        
        }

       
      </Paper>
      :<Paper elevation={3} sx={{marginX:3,padding:2,marginBottom:5}}>
          <Typography variant="h5" gutterBottom>
           You need to login if you would like to create a post or even like or comment on other users posts.
          </Typography>

          <Typography variant="h6" gutterBottom>
          Below is a message from my developer😃
          </Typography>

          <Typography variant="caption" gutterBottom>
            "Hi there,My name is Mohamed ahmed,memory bank is one of my portfolio projects,i am gonna be adding more features soon like chat functionality/follow functionality and make this app even more interactive!.".
          </Typography>
        
      </Paper>

      }

      {(!searchText && !searchTags.length) && 

        <Paper elevation={3} sx={{marginX:3,padding:2,marginBottom:3}}>
          <Pagination page={page}/>
        </Paper>

      }


    </>
   

    
  )
}

export default Form