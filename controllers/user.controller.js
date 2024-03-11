import UserModel from "../models/user.model.js";
import errorHandler from "../hepers/dbErrorHandler.js"

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
    let user = req.profile;
    user.hashed_password = undefined
    user.salt = undefined
  
    res.status(200).json(user);
};

const update = (req, res, next) => {};

const remove = (req, res, next) => {};

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

export default {
    create,
    list,
    userByID,
    read,
    update,
    remove
};