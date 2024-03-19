import formidable from "formidable";
import dbErrorHandler from "../hepers/dbErrorHandler.js";
import PostModel from "../models/post.model.js";
import fs from "node:fs";

const feed = async (req, res, next) => {

    try {
        let user = req.profile;
        let following = user.following;

        let posts = await PostModel.find(
            { postedBy: { "$in": following } }
        )
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .sort("-created");

        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        })
    }
};


const listByUser = async (req, res, next) => {
    try {
        let user = req.profile;

        let posts = await PostModel.find({ postedBy: user._id })
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .sort("-created");

        res.json(posts)

    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        })
    }
}


const create = async (req, res, next) => {
    try {

        let user = req.profile;
        let form = formidable({ keepExtensions: true });
        let [fields, files] = await form.parse(req);
        let photo = files.photo[0];
        let text = fields.text[0];

        let post = { text, postedBy: user._id };

        post.photo = {
            data: fs.readFileSync(photo.filepath),
            type: photo.mimetype
        };


        let postModel = new PostModel(post);
        let postSave = await postModel.save();
        res.json(postSave);
    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        })
    }

}

const photo = async (req, res, next) => {
    if (req.post.photo.data) {
        res.set("Content-Type", req.post.photo.contentType)
        return res.send(req.post.photo.data);
    }
    else {
        res.status(400).json({
            error: "Photo not found"
        })
    }
};

const postByID = async (req, res, next, id) => {
    try {
        let post = await PostModel.findById(id);


        if (!post) {
            res.status(400).json({
                error: "Post not found"
            })
        }


        req.post = post;
        next();
    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        })
    }

}

const isPoster = async (req, res, next) => {

    try {
        let post = req.post;
        let _id = req.auth && req.auth._id;


        if (!(post && _id)) {
            res.status(400).json({
                error: "Not able to get the post"
            });
        }


        if (post.postedBy != _id) {
            res.status(400).json({
                error: "Not authorized to delete the post"
            });
        }

        next();
    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        });

    }

}

const remove = async (req, res, next) => { 
    let post  = req.post;

    try {
        let removepost = await post.deleteOne();
        res.send(removepost);
    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        })
    }
}


const like = async (req, res, next) => {
    let post = req.body.postId;
    let userId = req.body.userId;

    try {
        
        if(!(post && userId)){
            res.status(400).json({
                error: "Post not found"
            })
        }

        let likedpost = await PostModel.findByIdAndUpdate(post, { "$addToSet": { likes: userId }}, { new: true} );
        res.send(likedpost);
    } catch (error) {
        res.status(400).json({
            error: dbErrorHandler.getErrorMessage(error)
        })
    }
};


const unlike = async (req, res, next) => {
    let postId = req.body.postId;
    let userId = req.body.userId;

    let post = await PostModel.findByIdAndUpdate(postId, { "$pull": { likes: userId } }, { new: true });

    res.send(post);
};



const comments = async (req, res, next) => {
    let postId = req.body.postId;
    let comment = req.body.comment
};

const uncomments = async (req, res, next) => {

};


export default {
    feed,
    listByUser,
    create,
    photo,
    postByID,
    isPoster,
    remove,
    like,
    unlike,
    comments,
    uncomments
};