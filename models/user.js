
const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/userProfileImg.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
}, { timestamps: true }); 

userSchema.pre('save', function(next) {
    const user = this;//this is refring to the document inside the userSchema if we directly use userSchem.name etc it will print the name as userSchema itself

    if (!user.isModified('password')) {
        return next();
    }
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    user.salt = salt;
    user.password = hashedPassword;
    next();
});
userSchema.static('matchPassword',async function(email,password){
    const user=await this.findOne({email});
    if(!user) return false;
    const salt=user.salt;
    const hashedPassword=user.password;
    const userHashedPassword=createHmac('sha256',salt).update(password).digest('hex'); 
    if(hashedPassword===userHashedPassword){
        return true;
    }else{
        return false;
    }
})
userSchema.static('user',async function(email){
    const user =await this.findOne({email});
    return user;
})
const UserInDatabase = mongoose.model("BlogyBoUser", userSchema);
module.exports = UserInDatabase;
