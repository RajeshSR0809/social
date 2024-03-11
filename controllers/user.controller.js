import UserModel from "../models/user.model.js";
import errorHandler from "../hepers/dbErrorHandler.js"
import extend from "lodash/extend.js";

const create = async (req, res, next) => {
    const user = new UserModel(req.body);
    try {
        await user.save();
        res.status(200).json({"message": "Successfully signed up"})
    } catch (error) {
        res.status(400).json({error: errorHandler.getErrorMessage(error)})
    }
}

const list = async (req, res, next) => {
    try {
        let userList = await UserModel.find({}, "name email created updated");   
        res.status(200).json(userList); 
    } catch (error) {
        res.status(400).json({error: errorHandler.getErrorMessage(error)})
    }
    
}

const read = (req, res, next) => {
    let user = _read(req);
    res.status(200).json(user);
};

const update = async (req, res, next) => {
    try {
        let user = _update(req);
        await user.save();
        user = _read(req);
        res.status(200).json(user);
            
    } catch (error) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        });
    }

};

const remove = async (req, res, next) => {
    try {
        let user = req.profile;
        let deletedUser =  await user.deleteOne();
        delete deletedUser.hashed_password;
        delete deletedUser.salt;
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })        
    }
};

const userByID = async (req, res, next, id) => {
    try {
        let profile = await UserModel.findById(id)
        .populate("following", "_id name")
        .populate("followers", "_id name");
        if(profile){
            req.profile = profile;
            next();
        }
        else {
            res.status(400).json({
                error: "User Not Found"
            });
        }        
    } catch (error) {
        res.status(400).json({
            error: "Not able to retrive user"
        })
    }

}


const _read = function(req){
    let user = req.profile;
    user.hashed_password = undefined
    user.salt = undefined
    return user;
}

const _update = function(req){
    let profile = req.profile;
    let updateProfile = req.body;
    let user = extend(profile, updateProfile);
    user.update = Date.now();
    return user;
}


export default {
    create,
    list,
    userByID,
    read,
    update,
    remove
};