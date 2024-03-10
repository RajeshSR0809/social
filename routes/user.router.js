import express from "express";
import userCntr from "../controllers/user.controller.js"
let router = express.Router();



router.route("/")
.post(userCntr.create);


export default router;