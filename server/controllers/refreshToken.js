const queryAsync = require("../db/connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async(req, res) => {

  const cookies = req.cookies;
  console.log(cookies.jwt);
  if(!cookies?.jwt == null) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  queryAsync("SELECT * FROM user WHERE refresh_token = ?", refreshToken)
    .then((response) => {
      //console.log(response[0]);
      if (response.length > 0) {
            const user = response[0].username;
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN,
                (err,decoded) => {
                    if(err || user !== decoded.UserInfo.username) res.sendStatus(403);
                    const role = response[0].role;
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "username": decoded.UserInfo.username,
                                "role": decoded.UserInfo.role
                            }
                        },
                        process.env.TOKEN,
                        {
                            expiresIn: 300
                        }
                    );
                    res.json({user, role, accessToken})
                }
            )
      }
    })
    .catch((err) => {
      res.sendStatus(401);
    });
};

module.exports = { handleRefreshToken };