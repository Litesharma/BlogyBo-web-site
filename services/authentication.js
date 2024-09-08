const jwt=require("jsonwebtoken");
const secret="$do||@R";
function createTokenForUser(email){
    const payLoad={
        email:email,
    }
    const token=jwt.sign(payLoad,secret);
    return token;
};
function validateTokenFromUser(token){
    const payLoad=jwt.verify(token,secret);
    return payLoad;
};


module.exports={
    createTokenForUser,
    validateTokenFromUser,
};