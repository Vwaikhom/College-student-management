const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require('../../middleware/paginate');
const sqlqueries = require('../../db/sql.json');
const queryAsync = require('../../db/connection');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

let sql = sqlqueries.SQLQueries.models.find(ele => {return (ele.modelName === "student-profile")})
const pagination = sql.Queires.pagination;
const sql3 = "SELECT s.*, sem.DSC,sem.DSE,sem.GEC,sem.AECC,sem.SEC,sem.VAC1,sem.VAC2 FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID \
WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ?  AND sem.PRMOTED = 'N' AND s.STUDENT_NAME LIKE ";


router.route('/')
    .post(verifyJWT,verifyRoles("Admin","Editor"),(req,res) => {
    //console.log(req.body);
    let query = "CALL NEW_STUDENT";
    let values = "(";
    Object.getOwnPropertyNames(req.body.data).forEach(val => {
        //fields += val + ", ";
        if(req.body.data[val] === null){
            values += `"",`;
        } else{
            if(typeof req.body.data[val] == 'number'){
                values += `${req.body.data[val]}` + ", ";
            } else{
                values += `"${req.body.data[val]}"` + ", "
            }
        }
    })
    //fields = fields.slice(0,-2);
    values = values.slice(0,-2);
    values += ");";
    console.log(values);
    let sqlQuery = (query + values);
    queryAsync(sqlQuery).
    then((result) => {
        const ID = result[0][0].ID;
        //res.json(result[0][0].ID);
        queryAsync('SELECT COLLEGE_ROLL_NO FROM student_profile WHERE ID = ?',[ID])
        .then((roll) => {
            console.log(roll);
            res.json({ROLL_NUMBER: roll[0].COLLEGE_ROLL_NO});
        })
    })
    .catch((err) => {
        res.err({err: err});
    })
});

router.route('/:year/:sem')
    .get(paginate(pagination[0], pagination[1], sql3), (req,res,next) => {
    res.json(res.paginatedResult);
})

router.route('/:year/:sem/:id')
    .get((req,res) => {
        const {course,sem,id} = req.params;
        queryAsync(sql.Queires.viewID, [id])
        .then(result => {
            //console.log(result);
            res.json(result);
        })
    })
    .put(verifyJWT,verifyRoles("Admin"), (req,res) => {
        const {id} = req.params;
        let query = "UPDATE student_profile SET ";
        let updated = "";

        if('SUB' in req.body){
            console.log(req.body.SUB);
        }

        Object.getOwnPropertyNames(req.body).forEach(val => {
                //console.log(val);
                if(val == 'DOB' || val == 'DATE_FORM_SUB'){
                    //req.body[val] = req.body[val].slice(0,10);
                    //req.body[val] = 
                    updated += (val + ' = ' + `"${req.body[val]}",`);
                }
                else if(typeof req.body[val] == 'number'){
                    updated += (val + ' = ' + `${req.body[val]},`)
                } else{
                    updated += (val + ' = ' + `"${req.body[val]}",`)
                }
            }
        )
        query = query + updated.slice(0, -1) + " WHERE ID = ?";
        //console.log(query);
        const responsePayload = {};

        queryAsync(query,[id])
        .then(result => {
            responsePayload.updateResult = result;
        })
        .catch((err) => {
            responsePayload.updateError = err;
        })

        res.json(responsePayload);
    })
    .delete(verifyJWT, verifyRoles("Admin"),(req,res) => {
        const {id} = req.params;
        console.log(id);
        queryAsync(`CALL DELETE_RECORD(${id})`)
        .then((result) => {
            console.log(result);
            res.json(result);
        })
    });

module.exports = router;