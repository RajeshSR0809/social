import UserModel from "../models/user.model.js";
import errorHandler from "../hepers/dbErrorHandler.js"
import extend from "lodash/extend.js";
import formidable from "formidable";
import fs from "node:fs";

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


const addFollowings = async(req, res, next) => {
    try {
        
        let userId = req.body.userId;
        let followId = req.body.followId;


        await UserModel.findByIdAndUpdate(userId, { "$addToSet": { following: followId } })
        
        next();
    } catch (error) {
        
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        });

    }
};

const addFollwers = async (req, res, next) => {
    
    try {
        let followingId = req.body.followId;
        let userId = req.body.userId;
    
    
        let result = await UserModel.findByIdAndUpdate(
            followingId, 
            { "$addToSet": { followers: userId } }, 
            { new: true } 
        )
        .populate("following", "_id name")
        .populate("followers", "_id name");
        result = result.toJSON();
    
        delete result.hashed_password;
        delete result.salt;
        res.status(200).json( result );        
    } catch (error) {
        res.status(400).json({
            error: "Failed to add to the follower"
        })
    }


};

const removeFollowings = async(req, res, next) => {
    try {
        let userId = req.body.userId;
        let unfollowId = req.body.unfollowId;

        await UserModel.findByIdAndUpdate(userId, { "$pull": { following: unfollowId } })

        next();
    } catch (error) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
};

const removeFollwers = async (req, res, next) => {

    try {
        let userId = req.body.userId;
        let unfollowId = req.body.unfollowId;
    
        let result = await UserModel.findByIdAndUpdate(
            unfollowId, 
            { "$pull": { followers: userId } }, 
            { new: true } 
        )
        .populate("following", "_id name")
        .populate("followers", "_id name");
        result = result.toJSON();
    
        delete result.hashed_password;
        delete result.salt;
        res.status(200).json( result );        
    } catch (error) {
        res.status(400).json({
            error: "Failed to remove from the follower"
        })
    }

};



const findPeople = async (req, res, next) => {
    try {
        let user = req.profile;
        
        
        if(!user){
            res.status(400).json({
                error: "Failed to get the user"
            })
        }


        let following = user.following;
        following.push(user._id); 


        let peopleToConnect = await UserModel.find({ _id: { "$nin": following } });

        res.status(200).json(peopleToConnect);
    } catch (error) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
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
    defaultPhoto,
    addFollowings,
    addFollwers,
    removeFollowings,
    removeFollwers,
    findPeople
};