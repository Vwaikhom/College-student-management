const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require("../../../middleware/paginate");
const queryAsync = require("../../../db/connection");
const verifyJWT = require("../../../middleware/verifyJWT");
const verifyRoles = require("../../../middleware/verifyRoles");
// const { route } = require('../../profile');
const modelData = require("../../../middleware/modelData");

const sql1 = 'SELECT COUNT(*) AS numRows FROM academic_record a JOIN student_semester sem ON a.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql2 = `SELECT s.STUDENT_NAME, s.ID,s.COLLEGE_ROLL_NO, sem.SEMESTER as CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE, a.IA, a.EA, a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?`;
const sql3 = 'SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER AS CURRENT_SEMESTER,s.COLLEGE_ROLL_NO, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,a.IA,a.EA,a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID AND sem.SEMESTER = ? AND sem.SEM_YEAR = ? WHERE s.STUDENT_NAME LIKE # OR s.COLLEGE_ROLL_NO LIKE #';

router.route('/:year/:sem')
    .get(paginate(sql1,sql2,sql3), (req,res) => {
        const result = modelData(res.paginatedResult.results);
        res.paginatedResult.results = result
        res.json(res.paginatedResult);
    });

router.route('/:year/:sem/:id')
    .post(verifyJWT, verifyRoles("Admin", "Editor"), (req,res) => {
        const {sem,year,id} = req.params;
        let query = "";
        
        let subjectSize = req.body.data.subjects.length;

        for(let i = 0; i < subjectSize; i++){
            query += `UPDATE academic_record a JOIN student_semester sem ON sem.ID = a.STUDENT_SEMESTER_ID JOIN student_profile s ON sem.STUDENT_PROFILE_ID = s.ID AND sem.SEMESTER = ${sem} AND sem.SEM_YEAR = ${year} SET IA = ${req.body.data.subjects[i].IA}, EA = ${req.body.data.subjects[i].IA},RESULT = '${req.body.data.subjects[i].RESULT}' WHERE SUB_CODE = '${req.body.data.subjects[i].SUB_CODE}' AND s.ID = ${id};`;

            if(req.body.data.subjects[i].RESULT === "F"){
                query += `INSERT INTO back_student (SUB_CODE,EA,BACK_CLEARED,STUDENT_ID) VALUES('${req.body.data.subjects[i].SUB_CODE}',${req.body.data.subjects[i].IA},"N",${id});`;
            }
        }
        
        queryAsync(query)
        .then((result) => {
            console.log(result);
            res.json({result:result, "message" : "Done"});
        })
        .catch((err) =>{
            res.json({err: err});
        });
    })

module.exports = router;
