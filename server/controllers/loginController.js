const queryAsync = require("../db/connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {

    const username = req.body.user;
    const password = req.body.pwd;

    queryAsync('SELECT username, password,role FROM user WHERE username = ?', username)
    .then((response) => {
        //console.log(response[0]);
        if(response.length > 0){
            bcrypt.compare(password, response[0].password,(err,result) => {
                if(result){
                    console.log(result);

                    const user = response[0].username;
                    const role = response[0].role;

                    const token = jwt.sign(
                        {
                            "UserInfo": {
                                "username": user,
                                "role": role
                            }
                        }, 
                        process.env.TOKEN,{
                        expiresIn: 300,             
                    })
                    const refreshToken = jwt.sign(
                        {
                            "UserInfo": {
                                "username": user,
                                "role": role
                            }
                        }, 
                        process.env.REFRESH_TOKEN,{
                        expiresIn: 60 * 60 * 24             
                    })
                    queryAsync('UPDATE user SET refresh_token = ? WHERE username = ?', [refreshToken, user])
                    .then((response) => {
                        console.log(response);
                    })
                    //req.session.user = result;
                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 }); 
                    res.json({auth: true, accessToken: token, role: role});
                } else{
                    //console.log(err);
                    res.status(401).json({"message": "Wrong username or password"});
                }
            })
        }
        else{
            res.send({auth: false, message: "User does not exist"})
        }
    })
    .catch((err) => {
        res.sendStatus(401);
    })
};

module.exports = { handleLogin };