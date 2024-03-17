import express from "express";
import userCntr from "../controllers/user.controller.js";
import authCntr from "../controllers/auth.controller.js";

let router = express.Router();


router.route("/api/users")
.get(userCntr.list)
.post(userCntr.create);


router.route("/api/users/defaultphoto")
.get(userCntr.defaultPhoto)


router.route("/api/users/photo/:userId")
.post(authCntr.requireSignin,authCntr.hasAuthorization, userCntr.photo)
.get(authCntr.requireSignin, authCntr.hasAuthorization, userCntr.readPhoto, userCntr.defaultPhoto)


router.route("/api/users/follow")
.put(authCntr.requireSignin, userCntr.addFollowings, userCntr.addFollwers);


router.route("/api/users/unfollow")
.put(authCntr.requireSignin, userCntr.removeFollowings, userCntr.removeFollwers);


router.route("/api/users/findpeople/:userId")
.get(authCntr.requireSignin, userCntr.findPeople)



router.route("/api/users/:userId")
.get(authCntr.requireSignin, userCntr.read)
.put(authCntr.requireSignin, authCntr.hasAuthorization, userCntr.update)
.delete(authCntr.requireSignin, authCntr.hasAuthorization, userCntr.remove)





router.param("userId", userCntr.userByID)



export default router;