const mysql = require('mysql2')
const Promise = require('bluebird')

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password123",
    database: "collegedbv1",
    timezone: 'Z'
});
const queryAsync = Promise.promisify(db.query.bind(db))

db.connect (function(err) {
    if(err) throw err;
    console.log("Connected!");
});

module.exports = queryAsync;