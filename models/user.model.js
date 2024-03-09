import mongoose, { Schema, model }  from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: "Name is required",
        trim: true
    },
    email: {
        type: String,
        required: "Email ID is required",
        trim: true,
        unique: "Email ID should be unique",
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    about: {
        type: String,
        trim: true
    },
    photo: {
        type: Buffer,
        contentType: String
    },
    following: [ { type: mongoose.Schema.ObjectId, ref: "User"} ],
    followers: [ { type: mongoose.Schema.ObjectId, ref: "User"} ],
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    } 
});


UserSchema.virtual("password")
.set((password) => {
    console.log(value);
    this._password = password;
})


const UserModel = new model("User", UserSchema);
export default UserModel;