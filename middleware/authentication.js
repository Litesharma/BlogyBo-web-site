const {validateTokenFromUser}=require("../services/authentication");
function checkCookieAuthentication(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        console.log(tokenCookieValue);
        if(!tokenCookieValue){
            return next();
        }
        else{
            const payLoad=validateTokenFromUser(tokenCookieValue);
            req.UserInDatabase=payLoad;
            return next();
        }
    }
}
module.exports={
    checkCookieAuthentication,
}