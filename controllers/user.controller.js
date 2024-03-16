import UserModel from "../models/user.model.js";
import errorHandler from "../hepers/dbErrorHandler.js"
import extend from "lodash/extend.js";
import formidable from "formidable";
import fs from "node:fs";
import defaultProfilePic from "../assets/profile-pic.png";

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


const photo  = async (req, res, next) => {

    try {
        let form = formidable({keepExtensions: true});
        let [fields, files] = await form.parse(req);
        let photo = files.photo[0];
        if(photo){
            let filePath = photo.filepath;
            let contentType = photo.mimetype;
            let user = req.profile;
            let userPhoto = {
                data: fs.readFileSync(filePath),
                contentType: contentType
            }
            await UserModel.findByIdAndUpdate(user.id, { $set: { photo: userPhoto } });
            res.status(200).json({
                message: "Photo uploaded successfully"
            })
        }
        else {
            res.status(400).json({
                error: "Not able to upload the photo"
            })
        }        
    } catch (error) {
        res.status(400).json({
            error: "Not able to upload the photo"
        })
    }

}

const update = async (req, res, next) => {
    try {
        let user = _update(req);

        let photo = await _fileUpdate();

        console.log(photo)
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

const readPhoto = async (req, res, next) => {
    let user = req.profile;

    try {
        if(user && user.photo && user.photo.data){
            res.set("Content-Type", user.photo.contentType);
            return res.send(user.photo.data);
        }
        else {
            next();
        }    
    } catch (error) {
        res.status(400).json({
            error: "Not able to read the photo"
        })
    }
    
}

const defaultPhoto = async (req, res, next) => {
    let path = "\\assets\\profile-pic.png"
    let cwd = process.cwd();
    res.sendFile(`${cwd}${path}`);
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
    remove,
    photo,
    readPhoto,
    defaultPhoto
};