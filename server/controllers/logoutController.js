const queryAsync = require("../db/connection");

const handleLogout = async (req, res) => {

  const cookies = req.cookies;

  if(!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  queryAsync("SELECT * FROM user WHERE refresh_token = ?", refreshToken)
    .then((response) => {
      //console.log(response[0]);
      if (response.length > 0) {
        const user = response[0].username;
        queryAsync("UPDATE user SET refresh_token = '' WHERE username = ?",[user]);

        res.clearCookie('jwt', { httpOnly: true });
        res.sendStatus(204);
      }
      else{
        res.clearCookie('jwt', { httpOnly: true });
        res.sendStatus(204);
      }
    })
    .catch((err) => {
        res.err({err: err});
    });
};

module.exports = { handleLogout };