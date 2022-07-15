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
const studentWise = require('./routes/academicRecord/studentWise/index');
const subjectWise = require('./routes/academicRecord/subjectWise/index');
const verifyJWT = require('./middleware/verifyJWT');
const jwt = require('jsonwebtoken');
const verifyRoles = require('./middleware/verifyRoles');
const excel = require('exceljs');
const bcrypt = require('bcrypt');
const https = require('https');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const queryAsync = require('./db/connection');
const {handleRefreshToken} = require('./controllers/refreshToken');
const {handleLogout} = require('./controllers/logoutController');
const {handleLogin} = require('./controllers/loginController');

const sql1 = 'SELECT COUNT(*) AS numRows FROM student_fee f JOIN student_semester sem ON f.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql2 = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.EXM_FEE, f.EXM_FEE_PHASE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql3 = 'SELECT COUNT(*) AS numRows FROM student_semester sem JOIN student_fee f on sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql4 = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.ADM_FEE, (SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql5 = 'SELECT COUNT(*) AS numRows FROM student_semester sem JOIN student_fee f on sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql6 = 'SELECT s.ID, s.STUDENT_NAME, sem.SEM_YEAR, sem.SEMESTER, sem.PROMOTED, f.ADM_FEE,f.EXM_FEE,f.EXM_FEE_PHASE, (SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON f.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? ORDER BY BACK_SUBS';
const sql9 = 'SELECT s.ID, s.STUDENT_NAME, sem.SEM_YEAR, sem.SEMESTER, sem.PROMOTED, f.ADM_FEE,f.EXM_FEE,f.EXM_FEE_PHASE, (SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON f.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND s.STUDENT_NAME LIKE #';
const sqlAdmissionStudent = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.ADM_FEE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND s.STUDENT_NAME LIKE #';
const sqlExaminationStudent = 'SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.EXM_FEE, f.EXM_FEE_PHASE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND s.STUDENT_NAME LIKE #';


const credentials = require('./middleware/credentials');
const corsOptions  = require('./config/corsOptions');


app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
app.use('/AcademicRecords/studentWise', studentWise);
app.use('/AcademicRecords/subjectWise', subjectWise);
app.get('/refresh', handleRefreshToken);
app.get('/logout', handleLogout);
app.post('/login', handleLogin);

app.post('/updateHonours/:course/:sem/:id', verifyJWT,verifyRoles("Admin"), (req,res) => {
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

app.put('/ExaminationFee/:sem/:year/:id', verifyJWT,verifyRoles("Admin"), (req,res) => {
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

app.put('/AdmissionFee/:sem/:year/:id', verifyJWT, verifyRoles("Admin"),(req,res) => {
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

app.get('/Promotion/:sem/:year', paginate(sql5,sql6,sql9), (req,res) => {
    res.json(res.paginatedResult);
})

app.post('/Promotion/:sem/:year/:id', verifyJWT, verifyRoles("Admin"), (req,res) => {
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

app.post('/Demotion/:sem/:year/:id',verifyJWT,verifyRoles("Admin"), (req,res) => {
    let {sem,year,id} = req.params;
    sem = parseInt(sem);
    year = parseInt(year);
    id = parseInt(id);

    console.log(sem,year,id);
    queryAsync(`CALL DEMOTE(${sem}, ${year}, ${id})`)
    .then((result) => {
        console.log(result);
        res.json(result);
    }) 

})

const sslServer = https.createServer({
   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')) 
},app)

app.use('/', (req, res, next) => {
    res.send("Hello from SSL server");
    next();
})

sslServer.listen(3001, () => {
    console.log("Listening on port 3001");
})
