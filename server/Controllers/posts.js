import postModel from "../Models/posts.js"


export const fetchPost = async(req,res)=>{
    const {id:_id}= req.params;
    try{
     const post = await postModel.findById(_id)
     res.status(200).json(post)
    }catch(error){
        console.log(error)
        res.status(404).send("invalid post id")
    }
    

    
}

export const fetchAllPosts = async (req,res)=>{
    const {page}=req.query;
    try{
        //limit for each page
        const LIMIT = 4;
        //get starting index for each page
        const startIndex = (Number(page)-1)*LIMIT;

        //all post documents count
        const total = await postModel.countDocuments({});

        const posts = await postModel.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});
  
    }catch(error){
        res.status(404).json(error)
    }
}

export const fetchPostsBySearch = async (req,res)=>{
    const {searchQuery,tags} = req.query;
   
    try{
        //converting title to regular expression and ignoring case type ie (test,TEST,Test) all will be same
        const title = new RegExp(searchQuery,"i");
       
         
        //retrieves all posts which contain that title or tags
        const posts = await postModel.find({$or: [ { title:title }, { tags:{$in:tags.split(",")} } ] })
        
        res.status(200).json(posts)
    }catch(error){
        res.status(404).json(error) 
    }
}

export const createPost = async(req,res)=>{
    try{
        const newPost = await postModel.create({...req.body,creatorId:req.userId});
        res.status(200).json(newPost)
    }catch(error){
        res.status(404).json(error)
    }
    

}

export const updatePost = async(req,res)=>{
    const {_id:id} = req.body;
    const updatedPost = await postModel.findByIdAndUpdate(id,req.body)
    res.status(200).json(updatedPost)

}

export const deletePost = async(req,res)=>{
    const {id} = req.params
    const deletedPost = await postModel.findByIdAndDelete(id)
    res.status(200).json(deletedPost)

}

export const likePost = async(req,res)=>{
    const {id:_id} = req.params;
    const post = await postModel.findById(_id);
    
    const index = post.likes.findIndex((id)=> id === req.userId);
    
    if(index === -1){
        post.likes.push(req.userId)
    }else{
        post.likes = post.likes.filter((id)=> id !== req.userId);
    }

    const likedPost = await postModel.findByIdAndUpdate(_id,post)
    res.status(200).json(likedPost)  
}

export const comment = async(req,res)=>{
    
    const {id:_id} = req.params;
    const comment = req.body;
    
    
    try{
        const post = await postModel.findById(_id)
        post.comments.push(comment)
        const commentedPost =  await postModel.findByIdAndUpdate(_id,post,{new:true})

        res.status(201).json({comment:comment,commentedPost})
    }catch(error){
        res.status(404).send("invalid id")
    }

    

}