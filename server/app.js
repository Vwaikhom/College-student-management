const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const Promise = require("bluebird");
//const db = require('./connection')
const paginate = require('./pagination')

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "tamcha60",
    database: "collegedbv1"
});

const queryAsync = Promise.promisify(db.query.bind(db));

db.connect (function(err) {
    if(err) throw err;
    console.log("Connected!");
});


app.get('/studentProfile',  (req,res) => {
    var numRows;
    var numPerPage = parseInt(req.query.npp, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    var numPages;
    var skip = (page-1) * numPerPage;
    var limit = skip + ',' + numPerPage;
    queryAsync('SELECT count(*) as numRows FROM student_profile')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
    })
    .then(() => queryAsync('SELECT * FROM student_profile LIMIT ' + limit))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined,
          numberofPages: numPages
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });

});

app.get('/studentSubjectCombination', (req,res) => {
    var numRows;
    var numPerPage = parseInt(req.query.npp, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    var numPages;
    var skip = (page-1) * numPerPage;
    var limit = skip + ',' + numPerPage;
    queryAsync('SELECT count(*) as numRows FROM student_profile')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
    })
    .then(() => queryAsync('SELECT s.STUDENT_NAME, s.ID, p.SUB_CODE1, p.SUB_CODE2, \
    p.SUB_CODE3, p.SUB_CODE_FC FROM student_profile s LEFT JOIN student_semester p ON s.ID = p.STUDENT_PROFILE_ID LIMIT ' + limit))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined,
          numberofPages: numPages
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
});

app.get('/studentProfile/:id', (req,res) => {
    const { id } = req.params;
    db.query("SELECT * FROM student_profile s, student_semester p WHERE s.ID = p.STUDENT_PROFILE_ID AND s.ID = ?",
    [id], (err, result) => {
        if(err){
            console.log(err);
        } else{
            //console.log(result);
            //res.status = 201;
            res.json(result);
        }
    }) 
});

app.get('/subjects/:id', (req,res) => {
    const { id } = req.params;
    db.query("SELECT * FROM student_semester WHERE STUDENT_PROFILE_ID = ?", [id], (err,result) => {
        if(err){
            console.log(err);
        } else{
            //console.log(result[0]);
            res.json(result[0]);
        }
    })
})

app.post('/createStudentProfile', async (req,res) => {
    //const ID = req.body.ID;
    const UHID = req.body.UHID;
    const ROLL_NO = req.body.ROLL_NO;
    const STUDENT_NAME = req.body.STUDENT_NAME;
    const SEX = req.body.SEX;
    const DATE_FORM_SUB = req.body.DATE_FORM_SUB;
    const PHOTO_URL = req.body.PHOTO_URL;
    const PRESENT_ADDRESS = req.body.PRESENT_ADDRESS;
    const PHONE_NO = req.body.PHONE_NO;
    const PERMANENT_ADDRESS = req.body.PERMANENT_ADDRESS;
    const FATHER_NAME = req.body.FATHER_NAME;
    const FATHER_OCCUPATION = req.body.FATHER_OCCUPATION;
    const MOTHER_NAME = req.body.MOTHER_NAME;
    const MOTHER_OCCUPATION = req.body.MOTHER_OCCUPATION;
    const ANNUAL_INCOME = req.body.ANNUAL_INCOME;
    const CLAIM_FEE_EXEMPTION = req.body.CLAIM_FEE_EXEMPTION;
    const DOB = req.body.DOB;
    const AADHAR_NO = req.body.AADHAR_NO;
    const EMAIL_ID = req.body.EMAIL_ID;
    const STUDENT_MOBILE = req.body.STUDENT_MOBILE;
    const CATEGORY = req.body.CATEGORY;
    const CLASS12_BOARD = req.body.CLASS12_BOARD;
    const CLASS12_ROLL = req.body.CLASS12_ROLL;
    const PASSOUT_YEAR = req.body.PASSOUT_YEAR;
    
    db.query(
        "INSERT INTO student_profile (UHID,STUDENT_NAME,SEX,DATE_FORM_SUB,PHOTO_URL,PRESENT_ADDRESS,PHONE_NO,PERMANENT_ADDRESS, \
            FATHER_NAME,FATHER_OCCUPATION, \
            MOTHER_NAME,MOTHER_OCCUPATION,ANNUAL_INCOME,CLAIM_FEE_EXEMPTION,DOB,AADHAR_NO,EMAIL_ID,STUDENT_MOBILE,CATEGORY, \
            CLASS12_BOARD, \
            CLASS12_ROLL,PASSOUT_YEAR) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [UHID,STUDENT_NAME,SEX,DATE_FORM_SUB,PHOTO_URL,PRESENT_ADDRESS,PHONE_NO,PERMANENT_ADDRESS, FATHER_NAME,FATHER_OCCUPATION,MOTHER_NAME,
        MOTHER_OCCUPATION,ANNUAL_INCOME,CLAIM_FEE_EXEMPTION,DOB,AADHAR_NO,EMAIL_ID,STUDENT_MOBILE,CATEGORY,CLASS12_BOARD,
        CLASS12_ROLL,PASSOUT_YEAR],
        (err,result) => {
            if(err){
                console.log(err);
            } else{
                console.log(result);
                res.send(result);
            }
        });
    });

    

app.post('/subjectsUpdate/:id', (req,res) => {
    let {id} = req.params;
    id = parseInt(id);
    const SUB_CODE1 = req.body.data.SUB_CODE1;
    const SUB_CODE2 = req.body.data.SUB_CODE2;
    const SUB_CODE3 = req.body.data.SUB_CODE3;
    const SUB_CODE_FC = req.body.data.SUB_CODE_FC;
    var SQLquery = "INSERT INTO student_semester (STUDENT_PROFILE_ID,  SUB_CODE1, SUB_CODE2, SUB_CODE3, SUB_CODE_FC) VALUES(?,?,?,?,?)" + 
    "ON DUPLICATE KEY UPDATE STUDENT_PROFILE_ID = VALUES(STUDENT_PROFILE_ID), SUB_CODE1 = VALUES(SUB_CODE1), SUB_CODE2 = VALUES(SUB_CODE2), SUB_CODE3 = VALUES(SUB_CODE3), SUB_CODE_FC = VALUES(SUB_CODE_FC)";

    db.query(SQLquery,[id,SUB_CODE1,SUB_CODE2,SUB_CODE3,SUB_CODE_FC], (err, result) => {
        if(err){
            console.log(err);
        } else{
            res.send(result);
        }
    });
});


app.get('/updateStudentProfile/:id', (req, res) => {
    const { id }  = req.params;
    db.query("SELECT * FROM student_profile WHERE ID = ?",[id], (err,result) => {
        if(err){
            console.log(err);
        } else {
                console.log(result);
                res.send(result);
            }
        });
});


app.put('/updateStudentProfile/:id', (req,res) => {
    const { id } = req.params;
    //const ID = req.body.ID;
    const UHID = req.body.UHID;
    const ROLL_NO = req.body.ROLL_NO;
    const STUDENT_NAME = req.body.STUDENT_NAME;
    const SEX = req.body.SEX;
    const DATE_FORM_SUB = req.body.DATE_FORM_SUB;
    const PHOTO_URL = req.body.PHOTO_URL;
    const PRESENT_ADDRESS = req.body.PRESENT_ADDRESS;
    const PHONE_NO = req.body.PHONE_NO;
    const PERMANENT_ADDRESS = req.body.PERMANENT_ADDRESS;
    const FATHER_NAME = req.body.FATHER_NAME;
    const FATHER_OCCUPATION = req.body.FATHER_OCCUPATION;
    const MOTHER_NAME = req.body.MOTHER_NAME;
    const MOTHER_OCCUPATION = req.body.MOTHER_OCCUPATION;
    const ANNUAL_INCOME = req.body.ANNUAL_INCOME;
    const CLAIM_FEE_EXEMPTION = req.body.CLAIM_FEE_EXEMPTION;
    const DOB = req.body.DOB;
    const AADHAR_NO = req.body.AADHAR_NO;
    const EMAIL_ID = req.body.EMAIL_ID;
    const STUDENT_MOBILE = req.body.STUDENT_MOBILE;
    const CATEGORY = req.body.CATEGORY;
    const CLASS12_BOARD = req.body.CLASS12_BOARD;
    const CLASS12_ROLL = req.body.CLASS12_ROLL;
    const PASSOUT_YEAR = req.body.PASSOUT_YEAR;
    
    db.query(
        "UPDATE student_profile SET UHID = ?,STUDENT_NAME = ?,SEX = ?,DATE_FORM_SUB = ?,PHOTO_URL = ?,PRESENT_ADDRESS = ?,PHONE_NO = ?,PERMANENT_ADDRESS = ?, \
            FATHER_NAME = ?,FATHER_OCCUPATION = ?, \
            MOTHER_NAME = ?,MOTHER_OCCUPATION = ?,ANNUAL_INCOME = ?,CLAIM_FEE_EXEMPTION = ?,DOB = ?,AADHAR_NO = ?,EMAIL_ID = ?,STUDENT_MOBILE = ?,CATEGORY = ?, \
            CLASS12_BOARD = ?, \
            CLASS12_ROLL = ?,PASSOUT_YEAR = ? WHERE ID = ?",
        [UHID,STUDENT_NAME,SEX,DATE_FORM_SUB,PHOTO_URL,PRESENT_ADDRESS,PHONE_NO,PERMANENT_ADDRESS, FATHER_NAME,FATHER_OCCUPATION,MOTHER_NAME,
        MOTHER_OCCUPATION,ANNUAL_INCOME,CLAIM_FEE_EXEMPTION,DOB,AADHAR_NO,EMAIL_ID,STUDENT_MOBILE,CATEGORY,CLASS12_BOARD,
        CLASS12_ROLL,PASSOUT_YEAR, id],
        (err,result) => {
            if(err){
                console.log(err);
            } else{
                console.log(result);
                res.send(result);
            }
        });
});


app.get('/getPhysics', (req,res) => {
    db.query("SELECT p.STUDENT_PROFILE_ID, s.STUDENT_NAME FROM student_profile s JOIN \
    student_semester p ON s.ID = p.STUDENT_PROFILE_ID \
    WHERE p.SUB_CODE1 = 'PHY101' OR p.SUB_CODE2 = 'PHY101' OR p.SUB_CODE3 = 'PHY101'", (err,result) => {
        if(err){
            console.log(err);
        } else{
            console.log(result.length)
            res.send(result);
        }
    })
})

app.delete('/deleteStudentProfile/:id', (req,res) => {
    const id = req.params.id;
    db.query("DELETE FROM student_profile WHERE ID = ?", [id], (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
            console.log(result);
        }
    }) 
})

app.get('/ExaminationFee', (req,res) => {
    var numRows;
    var numPerPage = parseInt(req.query.npp, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    var numPages;
    var skip = (page-1) * numPerPage;
    var limit = skip + ',' + numPerPage;
    queryAsync('SELECT count(*) as numRows FROM student_exam_fee')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
    })
    .then(() => queryAsync('SELECT s.STUDENT_NAME, s.ID, e.PAID,e.PHASE FROM student_profile s, \
    student_exam_fee e WHERE s.ID = e.student_profile_ID LIMIT ' + limit))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined,
          numberofPages: numPages
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
})


app.put('/ExaminationFee/:id', (req,res) => {
    let id = req.params.id;
    id = parseInt(id)
    //const paid = req.body.data.PAID;
    const PHASE = parseInt(req.body.data.PHASE);
    queryAsync("UPDATE student_exam_fee SET PAID = 'YES', PHASE = ? WHERE student_profile_ID = ?", [PHASE,id]).
    then((result) => {
        res.send(result);
    })
})

app.listen(3001, () => {
    console.log("Listening on port 3001");
})


// INSERT INTO student_semester (STUDENT_PROFILE_ID,  SUB_CODE1, SUB_CODE2, SUB_CODE3, SUB_CODE_FC) 
// VALUES(298, "BOT101", "MAT101", "ZOO101", "MAN101")
// ON DUPLICATE KEY UPDATE 
// 	STUDENT_PROFILE_ID = VALUES(STUDENT_PROFILE_ID);