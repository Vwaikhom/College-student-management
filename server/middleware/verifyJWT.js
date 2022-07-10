const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyJWT = (req,res,next) => {
    const token = req.headers["authorization"];

    if(token == null){
        res.sendStatus(401);
    }
    else{
        jwt.verify(token,process.env.TOKEN, (err, result) => {
            if(err){
                res.sendStatus(403)
            }
            else{
                req.user = result.UserInfo.user;
                req.role = result.UserInfo.role;
                next();
            }
        })
    }

}  

module.exports = verifyJWT;