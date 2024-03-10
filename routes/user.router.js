import express from "express";
import userCntr from "../controllers/user.controller.js"
let router = express.Router();



router.route("/")
.get(userCntr.list)
.post(userCntr.create);


router.route("/:userId")
.get(userCntr.read)
.put(userCntr.update)
.delete(userCntr.remove)


router.param("userId", userCntr.userByID)

export default router;