const express=require('express');
const path=require('path');
const router=require("./routes/user");
const {connectToMongoDb}=require('./connections/connections');
const cookieParser = require('cookie-parser');
const { checkCookieAuthentication } = require('./middleware/authentication');


const app=express();
const PORT=process.env.PORT ||8000;

app.set("view engine","ejs");
app.set("views",path.resolve("views"));

connectToMongoDb('mongodb://localhost:27017/BlogyBo').then(()=> console.log("dataBase connected")).catch((err)=> console.log('error occured',err));

app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.urlencoded({extended:false}));
app.use("/",router);
app.use(cookieParser());
app.use(checkCookieAuthentication("token"));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT,()=>{console.log("server started");})