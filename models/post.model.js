import mongoose, { model } from "mongoose";


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
        type: mongoose.Schema.ObjectId, 
        ref: "User" 
    },
    likes: [ 
        { 
            type: mongoose.Schema.ObjectId, 
            ref: "User" 
        } 
    ],
    created: { 
        type: Date, 
        default: Date.now
    },    
    comments: [{
        text: String,
        created: { 
            type: Date, 
            default: Date.now
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    }]
});




let PostModel  = model("Post", PostSchema)
export default PostModel;
