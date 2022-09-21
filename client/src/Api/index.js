import axios from "axios";


const API = axios.create({
    baseURL: 'https://memorybankapp1.herokuapp.com',
    withCredentials: true,
    headers: {
      'content-type': 'application/json',
    }

});

//sending a token for auth to the backend  with each request
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
      req.headers.googleId = JSON.parse(localStorage.getItem('profile'))?.profileObj?.googleId;
    }
  
    return req;
});

export const fetchPost = (id)=>API.get(`/posts/post/${id}`);
export const fetchAllPosts = (page)=> API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery)=> API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags || 'no,tags'}`)
export const createPost = (postData)=> API.post("/posts",postData);
export const deletePost = (postId) => API.delete(`/posts/${postId}`);
export const updatePost = (post) => API.patch("/posts",post);
export const likePost = (id)=>API.patch(`/posts/${id}/likepost`)
export const comment = (id,comment)=>API.patch(`/posts/${id}/comments`,comment)

export const sendSignUpData = (data) => API.post("/auth/signUp",data);
export const sendLoginData = (data) => API.post("/auth/login",data);
export const sendGoogleData = (data)=> API.post("/auth/google",data);


