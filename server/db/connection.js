const mysql = require('mysql2')
const Promise = require('bluebird')
require('dotenv').config()

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: process.env.DB_CONNECTION_PASSWORD,
    database: "collegedbv1",
    timezone: 'Z'
});
const queryAsync = Promise.promisify(db.query.bind(db))

db.connect (function(err) {
    if(err) throw err;
    console.log("Connected!")
});

module.exports = queryAsync;