import UserModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import config from "../config.js";
import { expressjwt } from "express-jwt";

const signin = async function(req, res, next){
    try {
        let email = req.body.email;
        let password = req.body.password;
        let user = await UserModel.findOne({email});
        if(user && user.authenticate(password)){
            
            let token = jsonwebtoken.sign({_id: user._id}, config.jwtSecret);
            
    
            res.cookie("t", token, Date.now() + 9999);
            
            
            res.status(200).json({
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id
                }
            })
        }
        else {
            res.status(401).json({
                error: "Unable to login"
            });
        }
    } catch (error) {
        res.status(401).json({
            error: "Unable to login"
        });
    }
};

const signout = async function(req, res, next){
    res.clearCookie("t");
    res.status(200).json({
        message: "signed out"
    });
};

const requireSignin = expressjwt({
    secret: config.jwtSecret,
    requestProperty: "auth",
    algorithms: ["HS256"]
});

const hasAuthorization = async function(req, res, next){
    let isAuth = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!isAuth){
        res.status(403).json({
            error: "User is not authorized"
        })
    }

    next();
};


export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}