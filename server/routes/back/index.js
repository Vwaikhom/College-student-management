const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require('../../helpers/paginate');
const sqlqueries = require('../../db/sql.json');
const queryAsync = require('../../db/connection');

router.route('/')
    .get( (req,res) => {
        if(req.query.subject){
            let sub = req.query.subject;
            sub = `'${sub}'`;
            queryAsync('SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,a.IA,a.EA FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID LEFT JOIN back_student b ON s.ID = b.STUDENT_ID AND a.SUB_CODE = b.SUB_CODE WHERE b.BACK_CLEARED = "N" AND b.SUB_CODE = ' + sub)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                res.json({err: e});
            })
        }
        else{
            queryAsync('SELECT s.STUDENT_NAME, s.ID, sem.SEMESTER AS CURRENT_SEMESTER, sem.SEM_YEAR, a.COURSE, a.SUB_CODE,b.IA,b.EA FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN academic_record a ON sem.ID = a.STUDENT_SEMESTER_ID LEFT JOIN back_student b ON s.ID = b.STUDENT_ID AND a.SUB_CODE = b.SUB_CODE WHERE b.BACK_CLEARED = "N"')
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                res.json({err: e});
            })
        }
    })
router.route('/back/:id')
    .post( (req,res) => {
        const {id} = req.params;
        const IA = req.body.data.IA;
        const EA = req.body.data.EA;
        let sub = req.body.data.SUB_CODE;
        //sub = `'${sub}'`; 
        queryAsync('INSERT INTO back_student (SUB_CODE,IA,EA,BACK_CLEARED,STUDENT_ID) VALUES (?,?,?,"N",?)',[sub,IA,EA,id])
        .then((result) => {
            console.log(result);
            res.json(result);
        })
    })


router.route('/:id')
    .put((req,res) => {
        const {id} = req.params;
        const IA = req.body.data.IA;
        const EA = req.body.data.EA;
        let sub = req.body.data.SUB_CODE;
        sub = `'${sub}'`; 

        if(req.query.cleared){
            queryAsync("UPDATE back_student SET BACK_CLEARED = 'Y' WHERE STUDENT_ID = ?", [id])
            .then((result) => {
                console.log(result);
                res.json(result);
            })
        }
        else{
            queryAsync('UPDATE back_student SET IA = ?, EA = ? WHERE STUDENT_ID = ?', [IA,EA,id])
            .then((result) => {
                console.log(result);
                res.json(result);
            })
        }
    })


module.exports = router;