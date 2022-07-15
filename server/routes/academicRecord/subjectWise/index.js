const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require("../../../middleware/paginate");
const queryAsync = require("../../../db/connection");
const verifyJWT = require("../../../middleware/verifyJWT");
const verifyRoles = require("../../../middleware/verifyRoles");
//const { route } = require('../../profile');

const sql1 = 'SELECT COUNT(*) AS numRows FROM academic_record a JOIN student_semester sem ON a.STUDENT_SEMESTER_ID = sem.ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?';
const sql2 = `SELECT s.STUDENT_NAME, s.ID,s.COLLEGE_ROLL_NO, sem.SEMESTER as CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE, a.IA, a.EA, a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?`;
const sql3 = 'SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,a.IA,a.EA,a.RESULT FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND SUB_CODE LIKE #';

router.route('/:year/:sem')
    .get(paginate(sql1,sql2,sql3),(req,res) => {
        res.json(res.paginatedResult)
    });

router.route('/:year/:sem/:id')
    .put(verifyJWT, verifyRoles("Admin", "Editor"), (req,res) => {
        const {sem,year,id} = req.params;
        const IA = req.body.data.IA;
        const EA = req.body.data.EA;
        let RESULT = req.body.data.RESULT;
        let SUB_CODE = req.body.data.SUB_CODE;
        SUB_CODE = `'${SUB_CODE}'`;
        console.log(RESULT,SUB_CODE);
    
        queryAsync("UPDATE academic_record a JOIN student_semester sem ON sem.ID = a.STUDENT_SEMESTER_ID JOIN student_profile s ON sem.STUDENT_PROFILE_ID = s.ID AND sem.SEMESTER = ? AND sem.SEM_YEAR = ? SET a.IA = ?, a.EA = ?, a.RESULT = ? WHERE s.ID = ? AND a.SUB_CODE = " + SUB_CODE, [sem,year,IA,EA,RESULT,id])
        .then((result) => {
            console.log(result);
            res.json(result);
        })
    })

module.exports = router;