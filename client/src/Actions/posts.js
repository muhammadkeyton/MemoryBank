import * as api from "../Api/index"

export const getPost = async (id)=>{
    try{
        const {data} = await api.fetchPost(id)
        return data;
    }catch(error){
        console.log(error)
    }
}

export const getPostsBySearch = async (searchQuery)=>{
    try{
        const {data} = await api.fetchPostsBySearch(searchQuery)
        return data;
    }catch(error){
        console.log(error)
    }
    
}

export const getAllPosts = async(page)=>{
    try{
        const {data} = await api.fetchAllPosts(page);
        return data;
    }catch(error){
        console.log(error)
    }
}

export const createPost = async(postData)=>{
    try{
        const {data} = await api.createPost(postData);
        return data;  
    }catch(error){
        console.log(error)
    }
    
    
}

export const updatePost = async(post) =>{
    try{
        const {data} = await api.updatePost(post);
        return data;
    }catch(error){
        console.log(error)
    }
}

export const deletePost = async (postId) =>{
    try{
        const {data} = await api.deletePost(postId);
        return data;
    }catch(error){
        console.log(error)
    }
}

export const likePost = async(postId)=>{
    try{
        const {data} = await api.likePost(postId)
        return data;
    }catch(error){
        console.log(error)
    }
}

export const Comment = async(postId,comment)=>{
    try{
        const {data} = await api.comment(postId,comment)
        return data;
    }catch(error){
        console.log(error)
    }
}