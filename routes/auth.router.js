import express from "express";
import authCntrl from "../controllers/auth.controller.js";
const router = express.Router();


router.route("/api/signin")
.post(authCntrl.signin);

router.route("/api/signout")
.post(authCntrl.signout);

export default router;