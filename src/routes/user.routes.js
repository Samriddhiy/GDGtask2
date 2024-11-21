import { Router } from "express";
import {loginUser ,logoutUser ,  registerUser , changeCurrentPassword , getCurrentUser, createPost} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
// secured routes

router.route("/logout").post(verifyJWT , logoutUser)
router.route("/change-password").post(changeCurrentPassword)
router.route("/current-user").get(getCurrentUser);
router.route("/post").post(createPost);

export default router 