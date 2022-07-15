function modelData(result) {
    
    let studentSet = new Set();

    let studentSubjectMap = {};

    let studentSize = result.length;

    for(let i = 0; i < studentSize; i++){
        if(!studentSet.has(result[i].ID)){
            const info = {};
            const subjects = [];
            info["STUDENT_NAME"] = result[i].STUDENT_NAME;
            info["COLLEGE_ROLL_NO"] = result[i].COLLEGE_ROLL_NO;
            info["SUBJECTS"] = subjects;
            studentSubjectMap[result[i].ID] = info;
            studentSet.add(result[i].ID);
        }
    }

    result.forEach(student => {
        let sub = {};
        sub["SUB_CODE"] = student.SUB_CODE;
        sub["COURSE"] = student.COURSE;
        sub["IA"] = student.IA;
        sub["EA"] = student.EA;
        sub["RESULT"] = student.RESULT;
        studentSubjectMap[student.ID].SUBJECTS.push(sub);
    });

    return studentSubjectMap;
    
}

module.exports = modelData;