import express from "express"
import { isAuthenticated } from "../middlewares/auth.js"
import singleUpload from "../middlewares/multer.js"
import { createPost } from "../controllers/postsController.js"

const router = express.Router()
router.post('/create', isAuthenticated, singleUpload, createPost)


export default router