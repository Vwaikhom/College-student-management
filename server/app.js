const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const paginate = require('./middleware/paginate')
const db = require('./db/connection');
const profileRoutes = require('./routes/profile/index');
const subjectCombinationRoutes = require('./routes/subjectCombination/index'); 
const downloadManager = require('./routes/downloads/index')
const backStudentRoute = require('./routes/back/index')
const verifyJWT = require('./middleware/auth');
const jwt = require('jsonwebtoken');

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
    methods: ["GET", "POST", "PUT", "DELETE"],
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


app.post('/updateHonours/:course/:sem/:id', verifyJWT, (req,res) => {
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

app.get('/ExaminationFee/:sem/:year', paginate(sql1, sql2, sqlExaminationStudent), (req,res) => {
  res.json(res.paginatedResult)
})

app.put('/ExaminationFee/:sem/:year/:id', verifyJWT, (req,res) => {
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

app.put('/AdmissionFee/:sem/:year/:id', verifyJWT, (req,res) => {
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

app.post('/Promotion/:sem/:year/:id', verifyJWT, (req,res) => {
    let {sem,year,id} = req.params;
    sem = parseInt(sem);
    year = parseInt(year);
    id = parseInt(id);
    console.log(req.body);
    let fee_due = "UNPAID";

    if(sem % 2 === 0){
        year = year + 1;
        fee_due = "PAID";
    }
    
    sem = sem + 1;

    console.log(sem,year,id);

    queryAsync(`CALL PROMOTE(${sem}, ${year}, ${id}, '${fee_due}')`)
    .then((result) => {
        console.log(result);
        res.json(result);
    }) 

})

app.post('/Demotion/:sem/:year/:id',verifyJWT, (req,res) => {
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

app.put('/updateAcademicRecord/:sem/:year/:id', verifyJWT, (req,res) => {
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

                    const user = response[0].username;
                    const token = jwt.sign({user}, process.env.TOKEN,{
                        expiresIn: 60 * 60 * 24,             
                    })

                    req.session.user = result;
                    res.json({auth: true, token: token});
                } else{
                    //console.log(err);
                    res.sendStatus(400);
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
})

app.listen(3001, () => {
    console.log("Listening on port 3001");
})
