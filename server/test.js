const bcrypt = require('bcrypt');
const saltRounds = 10;
const queryAsync = require('./db/connection');

function createUser (username, password, role){
    bcrypt.hash(password, saltRounds, (err, hash) =>  {
        if(err){
            console.log(err)
        } else{
            queryAsync('INSERT INTO USER (username, password,role) VALUES (?,?,?)', [username, hash,role])
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    });
}

createUser('admin1', 'adMin$22', 'Admin');

//editor => ediTor#22

// function modelData(result) {
    
//     let studentSet = new Set();

//     let studentSubjectMap = {};

//     let studentSize = result.length;

//     for(let i = 0; i < studentSize; i++){
//         if(!studentSet.has(result[i].ID)){
//             const info = {};
//             const subjects = [];
//             info["STUDENT_NAME"] = result[i].STUDENT_NAME;
//             info["COLLEGE_ROLL_NO"] = result[i].COLLEGE_ROLL_NO;
//             info["COURSE"] = result[i].COURSE;
//             info["SUBJECTS"] = subjects;
//             studentSubjectMap[result[i].ID] = info;
//             studentSet.add(result[i].ID);
//         }
//     }

//     result.forEach(student => {
//         let sub = {};
//         sub["SUB_CODE"] = student.SUB_CODE;
//         sub["IA"] = student.IA;
//         sub["EA"] = student.EA;
//         studentSubjectMap[student.ID].SUBJECTS.push(sub);
//     });

//     console.log(studentSubjectMap);
    
// }

// modelData(result);