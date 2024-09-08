const mongoose = require("mongoose");
const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImgUrl:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectID,
        ref:"UserInDatabase",
    }
},{ timestamps: true });
const blog=mongoose.model("blogs",blogSchema);
module.exports=blog;