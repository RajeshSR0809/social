import mongoose from "mongoose";
let PostSchema = mongoose.Schema({
    text: {
        type: String,
        required: "Post text is required"
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: { 
        _id: mongoose.Schema.ObjectId, 
        ref: "user" 
    },
    likes: [ 
        { 
            _id: mongoose.Schema.ObjectId, 
            ref: "user" 
        } 
    ],
    created: { 
        type: Date, 
        default: Date.now
    },    
    comments: {
        type: String,
        created: { 
            type: Date, 
            default: Date.now
        },
        postedBy: {
            _id: mongoose.Schema.ObjectId,
            ref: "User"
        }
    }
});




let PostModel  = mongoose.Schema("Post", PostSchema)
export default PostModel;
