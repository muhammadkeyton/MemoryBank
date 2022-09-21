import express from "express"

import { registerUsers,loginUsers,googleLogin } from "../Controllers/auth.js"

const router = express.Router()

router.post("/signUp",registerUsers);
router.post("/login",loginUsers);
router.post("/google",googleLogin)


export default router;