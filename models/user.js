var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bcrypt                = require("bcrypt-nodejs");

var UserSchema = new mongoose.Schema({
    username:   {type: String, unique: true, required: true},
    password:   String,
    avatar:     String,
    firstName:  String,
    lastName:   String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);