const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyJWT = (req,res,next) => {
    const token = req.headers["x-access-token"];

    if(token == null){
        res.json({"message": "No token found. Please login"});
    }
    else{
        jwt.verify(token,process.env.TOKEN, (err, result) => {
            if(err){
                res.json({auth: false, message: "Not authenticated"})
            }
            else{
                req.user = result.id;
                next();
            }
        })
    }

}  

module.exports = verifyJWT;