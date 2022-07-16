const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require('../../middleware/paginate');
const sqlqueries = require('../../db/sql.json');
const queryAsync = require('../../db/connection');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get( (req,res) => {
        if(req.query.name){
            let name = req.query.name;
            name = `'%${name}%'`;
            queryAsync('SELECT s.STUDENT_NAME, s.COLLEGE_ROLL_NO, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,b.EA FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID LEFT JOIN back_student b ON s.ID = b.STUDENT_ID AND a.SUB_CODE = b.SUB_CODE WHERE b.BACK_CLEARED = "N" AND s.STUDENT_NAME LIKE ' + name + ' OR s.COLLEGE_ROLL_NO LIKE ' + name + ' AND b.BACK_CLEARED = "N"')
            .then((result) => {
                console.log(result);
                res.json(result);
            })
            .catch((e) => {
                res.json({err: e});
            })
        }
        else{
            queryAsync('SELECT s.STUDENT_NAME, s.COLLEGE_ROLL_NO, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,b.EA FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID LEFT JOIN back_student b ON s.ID = b.STUDENT_ID AND a.SUB_CODE = b.SUB_CODE WHERE b.BACK_CLEARED = "N"')
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                res.json({err: e});
            })
        }
    })
router.route('/back/:id')
    .post(verifyJWT,verifyRoles("Admin","Editor"), (req,res) => {
        const {id} = req.params;
        let sub = req.body.data.SUB_CODE;
        //sub = `'${sub}'`; 
        queryAsync('INSERT INTO back_student (SUB_CODE,BACK_CLEARED,STUDENT_ID) VALUES (?,"N",?)',[sub,id])
        .then((result) => {
            console.log(result);
            res.json(result);
        })
    })


router.route('/:id')
    .put(verifyJWT, verifyRoles("Admin"),(req,res) => {
        const {id} = req.params;
        //const IA = req.body.data.IA;
        const EA = req.body.data.EA;
        let sub = req.body.data.SUB_CODE;
        sub = `'${sub}'`; 
        console.log(EA,sub)

        if(req.query.cleared === "true"){
            queryAsync("UPDATE back_student SET BACK_CLEARED = 'Y' WHERE STUDENT_ID = ?", [id])
            .then((result) => {
                console.log(result);
                res.json(result);
            })
        }
        else{
            queryAsync('UPDATE back_student SET EA = ? WHERE STUDENT_ID = ?', [EA,id])
            .then((result) => {
                console.log(result);
                res.json(result);
            })
        }
    })


module.exports = router;