import { createSlice } from '@reduxjs/toolkit'



const initialState = {
    value:[],
    upDateId:"",
    numberOfPages:0,
    currentPage:0,
    loading:false,
    post:null,
}

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers:{

        get_All_Posts:(state,action)=>{
            state.value = action.payload.posts;
            state.numberOfPages = action.payload.numberOfPages;
            state.currentPage = action.payload.currentPage;
        },
        
        create_Post:(state,action)=>{
           state.value.unshift(action.payload)
        },

        delete_Post:(state,action)=>{
            let newState=state.value.filter((p) => p._id !== action.payload);
            state.value = newState;
        },

        add_Update_Post_Id:(state,action)=>{
            state.upDateId = action.payload
        },

        remove_Update_Post_Id:(state,action)=>{
            state.upDateId = ""
        },

        update_Post:(state,action)=>{
            let updateIndex= state.value.findIndex((v)=> v._id === action.payload._id)
            state.value.splice(updateIndex, 1,action.payload);
        },
        like_Post:(state,action)=>{
            const {post,userId} = action.payload;
            
            let updateIndex= state.value.findIndex((v)=> v._id === post._id);
            let hasLiked = null;
            if(!action.payload.inPost){
                 hasLiked = state.value[updateIndex].likes.find((user)=> user === userId);
            }else{
                hasLiked = state.post.likes.find((user)=> user === userId);
            }
            
            //like functionality for both the card and inside the post,when post is opened
            if(hasLiked && !action.payload.inPost){
                state.value[updateIndex].likes=state.value[updateIndex].likes.filter((user)=>user !== userId)
            }else if(!hasLiked && !action.payload.inPost){
                state.value[updateIndex].likes.push(userId)

            }else if(hasLiked && action.payload.inPost){
                state.post.likes =state.post.likes.filter((id)=> id !== userId)
            }else if(!hasLiked && action.payload.inPost){
                state.post.likes.push(userId)
            }


        },
        get_posts_by_search:(state,action)=>{
            state.value = action.payload;
        },
        startPostLoading:(state,action)=>{
            state.loading = true;
        },
        stopPostLoading:(state,action)=>{
            state.loading = false;
        },
        get_post:(state,action)=>{
            state.post = action.payload;
            state.post.comments = action.payload.comments.reverse()
        },
        add_new_comment:(state,action)=>{
            const {comment} = action.payload
            state.post.comments.unshift(comment)
            
        }
       
    }
});

//exporting actions
export const {create_Post,get_All_Posts,delete_Post,add_Update_Post_Id,remove_Update_Post_Id,update_Post,like_Post,get_posts_by_search,startPostLoading,stopPostLoading,get_post,add_new_comment} = postsSlice.actions;

//exporting the reducer
export default postsSlice.reducer;