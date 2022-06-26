import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DatePicker from "react-date-picker";
import Select from 'react-select';

const Update = () => {

  const { course,sem,id } = useParams();
  const [updateDATE_FORM_SUB, setUpdateDateFormSub] = useState(new Date());
  const [updateDOB, setUpdateDOB] = useState(new Date());
  const [subject,setSubject] = useState("");
  const [student, setStudent] = useState({});
  const [updateFields, setUpdateFields] = useState({});
  const subjects = [
    {label: "Physics", value: "PHC", program:"BS"},
    {label: "Chemistry", value:"CHM", program:"BS"},                           
    {label: "Mathematics", value:"MAT", program:"BS"},                           
    {label: "Botany", value:"BOT", program:"BS"},                           
    {label: "Zoology", value:"ZOO", program:"BS"},                           
    {label: "Biochemistry", value:"BCH", program:"BS"},                           
    {label: "English", value:"ESL", program:"BA"},                           
    {label: "Manipuri", value:"MSL", program:"BA"},                           
    {label: "Economics", value:"ECO", program:"BA"},                           
    {label: "Geography", value:"GEG", program:"BA"},                           
    {label: "History", value:"HIS", program:"BA"} ,                          
    {label: "Philosophy", value:"PHI", program:"BA"},                           
    {label: "Physcholofy", value:"PSC", program:"BA"} ,                          
    {label: "Education", value:"EDN", program:"BA"}                           
  ]

  const onInputChange = e => {
    setUpdateFields({...updateFields, [e.target.name]: e.target.value})
  };
  const onNumberInputChange = e => {
    setUpdateFields({...updateFields, [e.target.name]: Number(e.target.value)})
  };

  const onDateSubChange = (date) => {

    setUpdateFields({...updateFields, DATE_FORM_SUB: new Date(date)})
  };

  const onDOBChange = (date) => {
    setUpdateFields({...updateFields, DOB: new Date(date)})
  };

  const handleSubjectChange = (subject) => {
    console.log(subject);
    // setProgram(subject.program);
    // setHonoursSubject(subject.value);
    setSubject(subject.value)
    //setUpdateFields({...updateFields, PROGRAM: subject.program})
  }


  useEffect(() => {
    LoadStudent();
  }, []);


  const formatDate = (date) => {
    let dateString = date.toLocaleDateString(undefined, {timeZone: 'Asia/Kolkata'});
    var DateArray = dateString.split("/");
    var finalDate = DateArray[2] + "-" + DateArray[0] + "-" + DateArray[1];
    return finalDate;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    let updatedSubject = "";

    for(let key in updateFields){
      // if((key === 'DOB' || key === 'DATE_FORM_SUB') && updateFields[key] != student[key]){
      //   data[key] = updateFields[key].toISOString();
      // }
      if(updateFields[key] != student[key]) data[key] = updateFields[key];
    }
    if(subject !== student.SUB){
      updatedSubject = subject
      //data["SUB"] = subject
    }

    data['DOB'] = formatDate(updateDOB);
    data['DATE_FORM_SUB'] = formatDate(updateDATE_FORM_SUB);
    //console.log(new Date(student.DOB.slice(0,19)));
    console.log(data);

    const updateResult = await axios.put(`http://localhost:3001/profile/${course}/${sem}/${id}`, data);

    if(updatedSubject !== ""){
      const updateSubjectResult = await axios.post(`http://localhost:3001/updateHonours/${course}/${sem}/${id}`, {'SUB': updatedSubject})
      console.log(updateSubjectResult);
    }
    console.log(updateResult);
    
  };

  const LoadStudent = async () => {
    //console.log(course,sem,id)
    const response = await axios.get(`http://localhost:3001/profile/${course}/${sem}/${id}`);
    const result = response.data[0];
    //console.log(result);

    // var tempDOB = result.DOB;
    // var tempDATE_FORM_SUB = result.DATE_FORM_SUB;

    // tempDOB = tempDOB.slice(0,19);
    // tempDATE_FORM_SUB = tempDATE_FORM_SUB.slice(0,19);
    
    // setDOB(new Date(tempDOB));
    // setDateFormSub(new Date(tempDATE_FORM_SUB));

    // var final = await {...result, DOB : new Date(result.DOB.slice(0,19)), DATE_FORM_SUB: new Date(result.DATE_FORM_SUB.slice(0,19)) };
    //console.log(final);
    //setDateFormSub(result.final)
    setStudent(result);
    setUpdateFields(result);
    setUpdateDateFormSub(new Date(result.DATE_FORM_SUB));
    setUpdateDOB(new Date(result.DOB));
    
    // subjects.forEach((sub) => {
    //   if(sub.value == result.SUB){
    //     setSubject(sub.value)
    //   }
    // })
    setSubject(result.SUB)
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit Student</h2>

        <form onSubmit={e => onSubmit(e)}>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Name"
              name="STUDENT_NAME"
              value={updateFields.STUDENT_NAME}
              onChange={e => onInputChange(e)}/>
          </div>

          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter UHID"
              name="UHID"
              value={updateFields.UHID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter Roll Number"
              name="ROLL_NO"
              value={updateFields.ROLL_NO}
              onChange={e => onNumberInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter SEX"
              name="SEX"
              value={updateFields.SEX}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <DatePicker onChange={setUpdateDateFormSub} value={updateDATE_FORM_SUB}/>
          </div>
         <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter photo URL"
              name="PHOTO_URL"
              value={updateFields.PHOTO_URL}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter present address"
              name="PRESENT_ADDRESS"
              value={updateFields.PRESENT_ADDRESS}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter phone number"
              name="PHONE_NO"
              value={updateFields.PHONE_NO}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter permanent address"
              name="PERMANENT_ADDRESS"
              value={updateFields.PERMANENT_ADDRESS}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter father's name"
              name="FATHER_NAME"
              value={updateFields.FATHER_NAME}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter father's occupation"
              name="FATHER_OCCUPATION"
              value={updateFields.FATHER_OCCUPATION}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter mother's name"
              name="MOTHER_NAME"
              value={updateFields.MOTHER_NAME}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter mother's occupation"
              name="MOTHER_OCCUPATION"
              value={updateFields.MOTHER_OCCUPATION}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter annual income"
              name="ANNUAL_INCOME"
              value={updateFields.ANNUAL_INCOME}
              onChange={e => onNumberInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Claim for Fee Exemption?"
              name="CLAIM_FEE_EXEMPTION"
              value={updateFields.CLAIM_FEE_EXEMPTION}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <DatePicker onChange={setUpdateDOB} value={updateDOB}/>
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter aadhaar"
              name="AADHAR_NO"
              value={updateFields.AADHAR_NO}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Email_id"
              name="EMAIL_ID"
              value={updateFields.EMAIL_ID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter student's phone number"
              name="STUDENT_MOBILE"
              value={updateFields.STUDENT_MOBILE}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter category"
              name="CATEGORY"
              value={updateFields.CATEGORY}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter university roll Number"
              name="UNIV_ROLL"
              value={updateFields.UNIV_ROLL}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter class 12 Board"
              name="CLASS12_BOARD"
              value={updateFields.CLASS12_BOARD}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter class 12 Roll number"
              name="CLASS12_ROLL"
              value={updateFields.CLASS12_ROLL}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter passout year"
              name="PASSOUT_YEAR"
              value={updateFields.PASSOUT_YEAR}
              onChange={e => onNumberInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <Select options={subjects} value={{label: subject}} onChange={handleSubjectChange}/>
          </div>
          <button className="btn btn-primary btn-block mt-3">
            Edit Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;


