import express from "express";
import userController from "../controllers/user.controller.js";
import authController from "../controllers/auth.controller.js";
import postController from "../controllers/post.controller.js";

let router = express.Router();

router.route("/api/posts/like")
.post(authController.requireSignin, postController.like)

router.route("/api/posts/unlike")
.put(authController.requireSignin, postController.unlike)

router.route("/api/posts/comment")
.put(authController.requireSignin, postController.comment)
router.route("/api/posts/uncomment")
.put(authController.requireSignin, postController.uncomment)


router.route("/api/posts/new/:userId")
.post(authController.requireSignin, postController.create)

router.route("/api/posts/photo/:postId")
.get(authController.requireSignin, postController.photo)


router.route("/api/posts/feed/:userId")
.get(authController.requireSignin, postController.feed)


router.route("/api/posts/by/:userId")
.get(authController.requireSignin, postController.listByUser)


router.route("/api/posts/:postId")
.delete(authController.requireSignin, postController.isPoster, postController.remove)



router.param("userId", userController.userByID);
router.param("postId", postController.postByID);


export default router;