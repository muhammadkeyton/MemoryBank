import express from "express";

import auth from "../Middleware/auth.js"
import { createPost,fetchAllPosts,deletePost,updatePost,likePost,fetchPostsBySearch,fetchPost,comment } from "../Controllers/posts.js";

const router = express.Router()

router.get("/search",fetchPostsBySearch)
router.get("/post/:id",fetchPost)
router.get("/",fetchAllPosts);

router.post("/",auth,createPost);
router.patch("/:id/likepost",auth,likePost);
router.patch("/:id/comments",auth,comment);
router.patch("/",auth,updatePost);

router.delete("/:id",auth,deletePost);



export default router;