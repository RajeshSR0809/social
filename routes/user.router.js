import express from "express";
import userCntr from "../controllers/user.controller.js";
import authCntr from "../controllers/auth.controller.js";

let router = express.Router();


router.route("/api/users")
.get(userCntr.list)
.post(userCntr.create);


router.route("/api/users/:userId")
.get(authCntr.requireSignin, userCntr.read)
.put(authCntr.requireSignin, authCntr.hasAuthorization, userCntr.update)
.delete(authCntr.requireSignin, authCntr.hasAuthorization, userCntr.remove)


router.param("userId", userCntr.userByID)

export default router;