const bcrypt = require('bcrypt');
const saltRounds = 10;
const queryAsync = require('./db/connection');

function createUser (username, password, role){
    bcrypt.hash(password, saltRounds, (err, hash) =>  {
        if(err){
            console.log(err)
        } else{
            queryAsync('INSERT INTO USER (username, password,role) VALUES (?,?,?)', [username, hash,role])
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    });
}

createUser('editor', 'ediTor#22', 'Editor');