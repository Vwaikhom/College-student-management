const express = require('express');
const router = express.Router({ mergeParams: true });
const paginate = require('../../helpers/paginate');
const sqlqueries = require('../../db/sql.json');
const queryAsync = require('../../db/connection');

let sql = sqlqueries.SQLQueries.models.find(ele => {return (ele.modelName === "student-profile")})
const pagination = sql.Queires.pagination;
const sql3 = 'SELECT s.*, sem.DSC,sem.DSE,sem.GEC,sem.AECC,sem.SEC,sem.VAC1,sem.VAC2 FROM student_profile s JOIN student_semester sem ON s.ID = sem.STUDENT_PROFILE_ID \
WHERE sem.SEMESTER = ? AND sem.SEM_YEAR = ? AND s.STUDENT_NAME LIKE ';

function isAdmin(req,res,next){
    if(req.cookies){
        next();
    }    
    else{
        res.sendStatus(401);
    }
}

router.route('/')
    .post(isAdmin,(req,res) => {
    console.log(req.body);
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
        console.log(result[0][0].ID);
        res.json(result[0][0].ID);
    })
});

router.route('/:year/:sem')
    .get(paginate(pagination[0], pagination[1], sql3), (req,res,next) => {
    res.json(res.paginatedResult);
})
// .post((req,res) => {
//     console.log(req.body);
//     console.log(req.body);
//     let query = "INSERT INTO student_profile ";
//     let fields = "";
//     let values = "";
//     Object.getOwnPropertyNames(req.body).forEach(val => {
//         if(req.body[val] !== ""){
//             fields += val + ", ";
//             if(typeof req.body[val] == 'number'){
//                 values += `${req.body[val]}` + ", ";
//             } else{
//                 values += `"${req.body[val]}"` + ", "
//             }
//         }
//     })
//     fields = fields.slice(0,-2);
//     values = values.slice(0,-2);
//     let sqlQuery = (query + `(${fields}) VALUES ` + `(${values})`);
//     queryAsync(sqlQuery).
//     then(result => {
//         res.json(result);
//     })
// });


//SELECT *, DATE_FORMAT(DATE_FORM_SUB, "%Y-%c-%d %H:%i:%s") AS FORMATTED_DATE_FORM, DATE_FORMAT(DOB,"%Y-%c-%d %H:%i:%s") AS FORMATTED_DOB FROM student_profile WHERE ID = 

router.route('/:year/:sem/:id')
    .get((req,res) => {
        const {course,sem,id} = req.params;
        queryAsync(sql.Queires.viewID, [id])
        .then(result => {
            //console.log(result);
            res.json(result);
        })
    })
    .put((req,res) => {
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
    });

    // router.route('/updateHonours/:course/:sem/:id')
    // .get((req,res) => {
    //     const {course,sem,id} = req.params;
    //     const honours_sub = req.body.updatedSubject;

    //     queryAsync(`CALL UPDATE_HONOURS_SUB("${honours_sub}", ${id})`)
    //     .then(result => {
    //         console.log(result);
    //         res.json(result);
    //     })
    //     .catch(err => {
    //         res.json({ err : err})
    //     })
    // })
module.exports = router;