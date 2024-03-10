import mongoose, { Schema, model }  from "mongoose";
import crypto from "node:crypto";

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


UserSchema
.virtual("password")
.set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password;
});

UserSchema.path("hashed_password").validate({
    validator: function(value){
        if(this._password && this._password.length < 6){
            console.log(this.invalidate)
            this.invalidate('password', 'Password must be at least 6 characters.');
        }
        if(this.isNew && !this._password){
            this.invalidate('password', 'Password is required');
        }
    },
});

UserSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        try {
            if(!password) return "";
            else {
                return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
            }
        } catch (error) {
            return "";
        }
    },
    makeSalt: function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    } 
}

const UserModel = new model("User", UserSchema);
export default UserModel;