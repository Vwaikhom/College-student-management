import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import DatePicker from "react-date-picker";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Update = () => {

  const { course,sem,id } = useParams();
  const [updateDATE_FORM_SUB, setUpdateDateFormSub] = useState(new Date());
  const [updateDOB, setUpdateDOB] = useState(new Date());
  const [subject,setSubject] = useState("");
  const [student, setStudent] = useState({});
  const [updateFields, setUpdateFields] = useState({});
  const [SEX, setSex] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const subjects = [
    {label: "Physics", value: "PHC", program:"BS"},
    {label: "Chemistry", value:"CHM", program:"BS"},                           
    {label: "Mathematics-Arts", value:"MAT", program:"BA"},                           
    {label: "Mathematics-Science", value:"MAT", program:"BS"},                           
    {label: "Botany", value:"BOT", program:"BS"},                           
    {label: "Zoology", value:"ZOO", program:"BS"},                           
    {label: "Biochemistry", value:"BCH", program:"BS"},                           
    {label: "English", value:"ESL", program:"BA"},                           
    {label: "Manipuri", value:"MIL", program:"BA"},                           
    {label: "Economics", value:"ECO", program:"BA"},                           
    {label: "Geography-Arts", value:"GEG", program:"BA"},                           
    {label: "Geography-Science", value:"GEG", program:"BS"},                           
    {label: "History", value:"HIS", program:"BA"} ,                          
    {label: "Philosophy", value:"PHI", program:"BA"},                           
    {label: "PolScience", value:"PSC", program:"BA"} ,                          
    {label: "Education", value:"EDN", program:"BA"}                           
  ]

  const sex = [
    {label: "M", value: "M"},
    {label: "F", value: "F"}
  ];

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

  const handleSexChange = (sex) => {
    setSex(sex.value);
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

    const updateResult = await axiosPrivate.put(`/profile/${course}/${sem}/${id}`, data);

    if(updatedSubject !== ""){
      const updateSubjectResult = await axiosPrivate.post(`/updateHonours/${course}/${sem}/${id}`, {'SUB': updatedSubject})
      console.log(updateSubjectResult);
      if(updateSubjectResult.statusText === "OK"){
        toast.success('Updated honours subject successfully!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
    }
    console.log(updateResult);
    if(updateResult.statusText === "OK"){
      toast.success('Updated student data successfully!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  };

  const LoadStudent = async () => {

    const response = await axiosPrivate.get(`/profile/${course}/${sem}/${id}`);
    const result = response.data[0];

    setStudent(result);
    setUpdateFields(result);
    setUpdateDateFormSub(new Date(result.DATE_FORM_SUB));
    setUpdateDOB(new Date(result.DOB));
    setSex(result.data.SEX);
    setSubject(result.SUB)
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit Student</h2>

        <form onSubmit={e => onSubmit(e)}>
        <label>Student Name</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Name"
              name="STUDENT_NAME"
              value={updateFields.STUDENT_NAME}
              onChange={e => onInputChange(e)}/>
          </div>
          <label>EXAM ID</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Exam ID"
              name="EXM_ID"
              value={updateFields.EXM_ID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <label>Enrollment ID</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Enrollment ID"
              name="ENROLL_ID"
              value={updateFields.ENROLL_ID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <label>University Registration ID</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter University Registration ID"
              name="UNIV_REG_ID"
              value={updateFields.UNIV_REG_ID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <label>University Exam Roll</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter University Exam ID"
              name="UNIV_EXM_ROLL"
              value={updateFields.UNIV_EXM_ROLL}
              onChange={e => onInputChange(e)}
            />
          </div>

          <label>SEX</label>
          <div className="form-group mt-3">
            <Select options={sex} value={{label: SEX}} onChange={handleSexChange}/>
          </div>
          <label>Date of Admission</label>
          <div className="form-group mt-3">
            <DatePicker onChange={setUpdateDateFormSub} value={updateDATE_FORM_SUB}/>
          </div>
          <label>Photo URL</label>
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
          <label>Present Address</label>
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
          <label>Phone Number</label>
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
          <label>Permanent Address</label>
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
          <label>Father's Name</label>
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
          <label>Father's Occupation</label>
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
          <label>Mother's Name</label>
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
          <label>Mother's Occupation</label>
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
          <label>Annual Income</label>
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
          <label>Claim for Fee Exemption?</label>
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
          <label>DOB</label>
          <div className="form-group mt-3">
            <DatePicker onChange={setUpdateDOB} value={updateDOB}/>
          </div>
          <label>Aadhar Number</label>
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
          <label>Email ID</label>
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
          <label>Student's Mobile Number</label>
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
          <label>Category</label>
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
          <label>University Roll Number</label>
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
          <label>Class 12 Board</label>
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
          <label>Class 12 Roll Number</label>
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
          <label>Passout Year</label>
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
          <label>Honours Subject</label>
          <div className="form-group mt-3">
            <Select options={subjects} value={{label: subject}} onChange={handleSubjectChange}/>
          </div>
          <button className="btn btn-primary btn-block mt-3">
            Edit Student
          </button>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default Update;


