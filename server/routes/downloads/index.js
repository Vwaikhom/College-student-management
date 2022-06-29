const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require('../../helpers/paginate');
const sqlqueries = require('../../db/sql.json');
const queryAsync = require('../../db/connection');
const { route } = require('../profile');

router.route('/studentProfile/:sem/:year')
    .get( (req,res) => {
        const {sem,year} = req.params;
        queryAsync('SELECT s.*, sem.PROMOTED FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?',[sem,year])
        .then((results) => {
            res.json(results);
        })
        .catch((e) => {
            res.json({err: e});
        })
    })

router.route('/subjectCombination/:sem/:year')
    .get( (req,res) => {
        const {sem,year} = req.params;
        queryAsync('SELECT s.STUDENT_NAME, S.ID, sem.DSC, sem.DSE, sem.AECC, sem.SEC, sem.VAC1, sem.VAC2 FROM student_profile s INNER JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? ',[sem,year])
        .then((results) => {
            res.json(results);
        })
        .catch((e) => {
            res.json({err:e});
        })
    })

router.route('/admissionFee/:sem/:year')
    .get((req,res) => {
        const {sem,year} = req.params;
        queryAsync('SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.ADM_FEE, (SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?',[sem,year])
        .then((results) => {
            res.json(results);
        })
        .catch((err) => {
            res.error({error:err});
        })
    })

router.route('/examFee/:sem/:year')
    .get((req,res) => {
        const {sem,year} = req.params;
        queryAsync('SELECT s.STUDENT_NAME, S.ID AS STUDENT_ID, f.EXM_FEE, f.EXM_FEE_PHASE,(SELECT COUNT(*) FROM back_student WHERE STUDENT_ID = s.ID AND BACK_CLEARED = "N") AS BACK_SUBS FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID JOIN student_fee f ON sem.ID = f.STUDENT_SEMESTER_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?',[sem,year])
        .then((results) => {
            res.json(results);
        })
        .catch((err) => {
            res.error({error:err});
        })
    })
module.exports = router;