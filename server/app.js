const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const paginate = require('./helpers/paginate')
const db = require('./db/connection');
const profileRoutes = require('./routes/profile/index');
const subjectCombinationRoutes = require('./routes/subjectCombination/index'); 
const downloadManager = require('./routes/downloads/index')
const backStudentRoute = require('./routes/back/index')

const excel = require('exceljs');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const queryAsync = require('./db/connection');

const sql1 = 'SELECT COUNT(*) AS numRows FROM student_fee f JOIN student_semester sem ON f.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql2 = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.EXM_FEE, f.EXM_FEE_PHASE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql3 = 'SELECT COUNT(*) AS numRows FROM student_semester sem JOIN student_fee f on sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql4 = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.ADM_FEE, (SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql5 = 'SELECT COUNT(*) AS numRows FROM student_semester sem JOIN student_fee f on sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql6 = 'SELECT s.ID, s.STUDENT_NAME, sem.SEM_YEAR, sem.SEMESTER, sem.PROMOTED, f.ADM_FEE,f.EXM_FEE,f.EXM_FEE_PHASE FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON f.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? ORDER BY s.ID'
const sql7 = 'SELECT COUNT(*) AS numRows FROM academic_record a JOIN student_semester sem ON a.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql8 = `SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER as CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE, a.IA, a.EA, a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?`
const sqlAdmissionStudent = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.ADM_FEE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND s.STUDENT_NAME LIKE ';
const sqlExaminationStudent = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.EXM_FEE, f.EXM_FEE_PHASE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND s.STUDENT_NAME LIKE ';

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    key: "userId",
    secret: "This should be a better secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}))

app.use('/profile', profileRoutes);
app.use('/subjectCombination', subjectCombinationRoutes);
app.use('/download', downloadManager);
app.use('/BackStudents', backStudentRoute);

function isAdmin(req,res,next){
    if(req.cookies){
        next();
    }    
    else{
        res.sendStatus(401);
    }
}

app.post('/addSubjectCombination', (req,res) => {
    const {aecc,sec,vac1,vac2, id} = req.body;
    
    let query = "CALL ADD_SUBJECT_COMBO_1";
    let values = `("${aecc}", "${sec}", "${vac1}", "${vac2}", ${id})`;
    const sqlQuery = query + values;
    console.log(sqlQuery);

    queryAsync(sqlQuery)
    .then((result) => {
        console.log(result);
        res.json(result);
    })
    .catch((err) => {
        console.log(err);
        res.json({err:err});
    })
})

app.post('/updateHonours/:course/:sem/:id', (req,res) => {
    const {course,sem,id} = req.params;
    //const honours_sub = req.body.updatedSubject;
    let query = `CALL UPDATE_STUDENT_HONOURS_SUB("${req.body.SUB}", ${id})`
    console.log(query);

    queryAsync(query)
    .then((result) => {
        console.log(result);
        res.json(result);
    })
    .catch(err => {
        res.json({ err : err})
    })
})



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
    const UHID = req.body.UHID;
    const ROLL_NO = req.body.ROLL_NO;
    const STUDENT_NAME = req.body.STUDENT_NAME;
    const SEX = req.body.SEX;
    const finalDATEFORM = req.body.finalDATEFORM;
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
    const finalDOB = req.body.finalDOB;
    const AADHAR_NO = req.body.AADHAR_NO;
    const EMAIL_ID = req.body.EMAIL_ID;
    const STUDENT_MOBILE = req.body.STUDENT_MOBILE;
    const CATEGORY = req.body.CATEGORY;
    const CLASS12_BOARD = req.body.CLASS12_BOARD;
    const CLASS12_ROLL = req.body.CLASS12_ROLL;
    const PASSOUT_YEAR = req.body.PASSOUT_YEAR;
    console.log(req.body);
    queryAsync(
        "INSERT INTO student_profile (UHID,STUDENT_NAME,SEX,DATE_FORM_SUB,PHOTO_URL,PRESENT_ADDRESS,PHONE_NO,PERMANENT_ADDRESS, \
            FATHER_NAME,FATHER_OCCUPATION, \
            MOTHER_NAME,MOTHER_OCCUPATION,ANNUAL_INCOME,CLAIM_FEE_EXEMPTION,DOB,AADHAR_NO,EMAIL_ID,STUDENT_MOBILE,CATEGORY, \
            CLASS12_BOARD, \
            CLASS12_ROLL,PASSOUT_YEAR) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [UHID,STUDENT_NAME,SEX,finalDATEFORM,PHOTO_URL,PRESENT_ADDRESS,PHONE_NO,PERMANENT_ADDRESS, FATHER_NAME,FATHER_OCCUPATION,MOTHER_NAME,
        MOTHER_OCCUPATION,ANNUAL_INCOME,CLAIM_FEE_EXEMPTION,finalDOB,AADHAR_NO,EMAIL_ID,STUDENT_MOBILE,CATEGORY,CLASS12_BOARD,
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

app.get('/ExaminationFee/:sem/:year', paginate(sql1, sql2, sqlExaminationStudent), (req,res) => {
  res.json(res.paginatedResult)
})


app.put('/ExaminationFee/:sem/:year/:id', isAdmin, (req,res) => {
    let id = req.params.id;
    id = parseInt(id)
    const {year,sem} = req.params;
    //console.log(req.body);
    let {EXM_FEE_PHASE} = req.body.data;
    EXM_FEE_PHASE = parseInt(EXM_FEE_PHASE);

    let flag = "";

    if(EXM_FEE_PHASE <= 0){
        flag = "UNPAID";   
    } else{
        flag = "PAID";
    }
    //console.log(EXM_FEE_PHASE,flag,year,sem,id)
    queryAsync('UPDATE student_fee f JOIN student_profile s ON s.ID = f.STUDENT_PROFILE_ID JOIN student_semester sem ON f.STUDENT_SEMESTER_ID = sem.ID SET f.EXM_FEE = ? , f.EXM_FEE_PHASE = ? WHERE sem.SEM_YEAR = ? AND sem.SEMESTER = ? AND s.ID = ?', [flag,EXM_FEE_PHASE,year,sem,id]).
    then((result) => {
        console.log(result);
        res.send(result);
    })
})

app.get('/AdmissionFee/:sem/:year', paginate(sql3,sql4,sqlAdmissionStudent), (req,res) => {
    res.json(res.paginatedResult)
})

app.put('/AdmissionFee/:sem/:year/:id', isAdmin, (req,res) => {
    let id = req.params.id;
    id = parseInt(id);
    const {year,sem} = req.params;
    console.log(req.body);
    let flag = req.body.data.flag;
    console.log(flag);
    queryAsync('UPDATE student_fee f JOIN student_profile s ON s.ID = f.STUDENT_PROFILE_ID JOIN student_semester sem ON f.STUDENT_SEMESTER_ID = sem.ID SET f.ADM_FEE = ? WHERE sem.SEM_YEAR = ? AND sem.SEMESTER = ? AND s.ID = ?', [flag,year,sem,id])
    .then((result) => {
        console.log(result);
        res.json(result);
    })
})

app.get('/Promotion/:sem/:year', paginate(sql5,sql6), (req,res) => {
    res.json(res.paginatedResult);
})

app.post('/Promotion/:sem/:year/:id', (req,res) => {
    let {sem,year,id} = req.params;
    sem = parseInt(sem);
    year = parseInt(year);
    id = parseInt(id);
    console.log(req.body);

    if(sem % 2 === 0){
        year = year + 1;
    }
    
    sem = sem + 1;

    console.log(sem,year,id);

    queryAsync(`CALL PROMOTE(${sem}, ${year}, ${id})`)
    .then((result) => {
        console.log(result);
        res.json(result);
    }) 

})

app.post('/Demotion/:sem/:year/:id', (req,res) => {
    let {sem,year,id} = req.params;
    sem = parseInt(sem);
    year = parseInt(year);
    id = parseInt(id);

    // if(sem % 2 === 0){
    //     year = year + 1;
    // }
    
    // sem = sem + 1;

    console.log(sem,year,id);
    queryAsync(`CALL DEMOTE(${sem}, ${year}, ${id})`)
    .then((result) => {
        console.log(result);
        res.json(result);
    }) 

})

app.get('/AcademicRecords/:sem/:year', paginate(sql7, sql8), (req,res) => {
    res.json(res.paginatedResult);
})

app.get('/SubjectWiseRecord/:sem/:year', (req,res) => {
    //res.json(res.paginatedResult);
    var {sem,year} = req.params;
    var sub = req.query.subject;
    sub = `'${sub}'`;
    console.log(sem,year,sub);
    //console.log(req.query);
    if(req.query.back === 'false'){
        queryAsync("SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,a.IA,a.EA,a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND SUB_CODE = " + sub, [sem,year])
        .then((results) => {
            var responsePayload = {
                results: results,
                pagination: {
                page:1,
                }
            }
            res.paginatedResult = responsePayload;
            //next();
            //console.log(res.paginatedResult);
            res.json(res.paginatedResult);
            //console.log(results);
        })
        .catch((err) => {
            res.json({err: err})
        })
    }
    else{
        queryAsync("SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,a.IA,a.EA,a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID LEFT JOIN back_student b ON s.ID = b.STUDENT_ID AND a.SUB_CODE = b.SUB_CODE WHERE sem.SEM_YEAR = 2021 AND a.SUB_CODE = " + sub + " AND sem.SEMESTER = 1 OR b.BACK_CLEARED = 'N' AND b.SUB_CODE = " + sub, [sem,year])
        .then((results) => {
            var responsePayload = {
                results: results,
                pagination: {
                page:1,
                }
            }
            res.paginatedResult = responsePayload;
            //next();
            //console.log(res.paginatedResult);
            res.json(res.paginatedResult);
            //console.log(results);
        })
        .catch((err) => {
            res.json({err: err})
        })
    }
})

app.put('/updateAcademicRecord/:sem/:year/:id', (req,res) => {
    const {sem,year,id} = req.params;
    //console.log(req.body.data.IA);
    const IA = req.body.data.IA;
    const EA = req.body.data.EA;
    let RESULT = req.body.data.RESULT;
    let SUB_CODE = req.body.data.SUB_CODE;
    //RESULT = `'${RESULT}'`; 
    SUB_CODE = `'${SUB_CODE}'`;
    console.log(RESULT,SUB_CODE);

    queryAsync("UPDATE academic_record a JOIN student_semester sem ON sem.ID = a.STUDENT_SEMESTER_ID JOIN student_profile s ON sem.STUDENT_PROFILE_ID = s.ID AND sem.SEMESTER = ? AND sem.SEM_YEAR = ? SET a.IA = ?, a.EA = ?, a.RESULT = ? WHERE s.ID = ? AND a.SUB_CODE = " + SUB_CODE, [sem,year,IA,EA,RESULT,id])
    .then((result) => {
        console.log(result);
        res.json(result);
    })
})

app.post('/login', (req,res) => {
    const username = req.body.user;
    const password = req.body.pwd;

    queryAsync('SELECT password FROM user WHERE username = ?', username)
    .then((response) => {
        //console.log(response[0]);
        if(response.length > 0){
            bcrypt.compare(password, response[0].password,(err,result) => {
                if(result){
                    console.log(result);
                    req.session.user = result;
                    res.send(result);
                } else{
                    //console.log(err);
                    res.sendStatus(400);
                }
            })
        }
        else{
            res.send({message: "User does not exist"})
        }
    })
    .catch((err) => {
        res.sendStatus(401);
    })
})

app.listen(3001, () => {
    console.log("Listening on port 3001");
})
