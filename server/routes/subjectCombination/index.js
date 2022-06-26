const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require('../../helpers/paginate');
const sqlqueries = require('../../db/sql.json');
const queryAsync = require('../../db/connection');

let sql = sqlqueries.SQLQueries.models.find(ele => {return (ele.modelName === "student-profile")})
const pagination = sql.Queires.pagination;

let query1 = "SELECT COUNT(*) AS numRows FROM student_semester WHERE SEMESTER = ? AND SEM_YEAR = ?";
let query2 = "SELECT s.STUDENT_NAME, S.ID, sem.DSE, sem.DSC, sem.AECC, sem.SEC, sem.VAC1, sem.VAC2 FROM student_profile s INNER JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?" 
let query3 = 'SELECT s.STUDENT_NAME, S.ID, sem.DSE, sem.DSC, sem.AECC, sem.SEC, sem.VAC1, sem.VAC2 FROM student_profile s INNER JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID WHERE sem.SEMESTER = 1 AND sem.SEM_YEAR = 2021 AND s.STUDENT_NAME LIKE '

router.route('/:year/:sem')
    .get(paginate(query1, query2,query3), (req,res,next)=> {
        res.json(res.paginatedResult);
    });

router.route('/:year/:sem/:id')
    .post((req,res) => {
        let {sem,id} = req.params;
        sem = parseInt(sem);
        id = parseInt(id);
        let query = "";
        const DSE = req.body.data.DSE;
        const GEC = req.body.data.GEC;
        const AECC = req.body.data.AECC;
        const SEC = req.body.data.SEC;
        const VAC1 = req.body.data.VAC1;
        const VAC2 = req.body.data.VAC2;
        //console.log(req.body, sem,id);
        if(sem == 1){
             query = `CALL ADD_SUBJECT_COMBO_1('${AECC}','${SEC}','${VAC1}','${VAC2}',${id})`;
        }
        else if(sem == 2){
             query = `CALL ADD_SUBJECT_COMBO_2('${AECC}','${SEC}','${VAC1}','${VAC2}',${id})`;
        }
        else if(sem == 3){
             query = `CALL ADD_SUBJECT_COMBO_3('${GEC}','${VAC1}', ${id})`;
        }
        else if(sem == 4){
             query = `CALL ADD_SUBJECT_COMBO_4('${GEC}','${VAC1}', ${id})`;
        }
        else if(sem == 5){
             query = `CALL ADD_SUBJECT_COMBO_5('${DSE}','${GEC}','${VAC1}', ${id})`;
        }
        else if(sem == 6){
             query = `CALL ADD_SUBJECT_COMBO_6('${DSE}','${GEC}','${VAC1}', ${id})`;
        }
        else if(sem == 7){
             query = `CALL ADD_SUBJECT_COMBO_7('${AECC}','${VAC1}',${id})`;
        }
        else if(sem == 8){
             query = `CALL ADD_SUBJECT_COMBO_8('${AECC}','${VAC1}',${id})`;
        }
        console.log(query);

        queryAsync(query)
        .then(result => {
            console.log(result);
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
    })

module.exports = router;