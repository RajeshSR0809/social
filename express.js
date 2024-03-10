import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import compress from "compression";
import helmet from "helmet";

import userRouters from "./routes/user.router.js";

const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())



app.use("/api/user", userRouters)

app.use((err, req, res, next) => {
    if(err.name == "UnauthorizedError"){
        res.status(401).json({"error": `${err.name} : ${err.message}`});
    }
    else if(err){
        res.status(400).json({"error": `${err.name} : ${err.message}`});
        console.error(err);
    }
})

export default app;