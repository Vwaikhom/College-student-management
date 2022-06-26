const bcrypt = require('bcrypt');
const saltRounds = 10;
const queryAsync = require('./db/connection');

function createUser (username, password){
    bcrypt.hash(password, saltRounds, (err, hash) =>  {
        if(err){
            console.log(err)
        } else{
            queryAsync('INSERT INTO USER (username, password) VALUES (?,?)', [username, hash])
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    });
}

createUser('admin', 'aDmin@58');