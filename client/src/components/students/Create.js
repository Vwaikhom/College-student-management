import { useState } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import {Link} from 'react-router-dom';
import NewSubjectCombo from "../pages/NewSubjectCombo";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
  const [STUDENT_NAME,setStudentName] = useState("");
  const [UHID,setUHID] = useState(null);
  const [SEX,setSex] = useState("");
  const [EXM_ID, setEXMID] = useState("");
  const [DATE_FORM_SUB, setDateFormSub] = useState(new Date());
  const [PHOTO_URL, setPhotoURL] = useState("");
  const [PRESENT_ADDRESS, setPresentAddress] = useState("");
  const [PHONE_NO, setPhoneNo] = useState("");
  const [PERMANENT_ADDRESS, setPermanentAddress] = useState("");
  const [FATHER_NAME, setFatherName] = useState("");
  const [FATHER_OCCUPATION, setFatherOccupation] = useState("");
  const [MOTHER_NAME, setMotherName] = useState("");
  const [MOTHER_OCCUPATION, setMotherOccupation] = useState("");
  const [ANNUAL_INCOME, setAnnualIncome] = useState(0);
  const [CLAIM_FEE_EXEMPTION, setClaim] = useState("");
  const [AADHAR_NO, setAadharNo] = useState("");
  const [EMAIL_ID, setEmail] = useState("");
  const [STUDENT_MOBILE, setStudentPhoneNo] = useState("");
  const [CATEGORY, setCategory] = useState("");
  const [ENROLL_ID, setEnroll] = useState("");
  const [CLASS12_BOARD, setClass12Board] = useState("");
  const [CLASS12_ROLL, setclass12Roll] = useState("");
  const [PASSOUT_YEAR, setPassOutYear] = useState(0);
  const [DOB, setDOB] = useState(new Date());
  const [PROGRAM, setProgram] = useState("");
  const [SUB, setHonoursSubject] = useState("");
  const [UNIV_REG_ID,setUnivReg] = useState("");
  const [UNIV_EXM_ROLL,setUnivExmRoll] = useState("");
  const [insertID, setInsertID] = useState("");

  const axiosPrivate  = useAxiosPrivate();

  const subjects = [
    {label: "Physics", value: "PHC", program:"BS"},
    {label: "Chemistry", value:"CHM", program:"BS"},                           
    {label: "Mathematics", value:"MAT", program:"BS"},                           
    {label: "Botany", value:"BOT", program:"BS"},                           
    {label: "Zoology", value:"ZOO", program:"BS"},                           
    {label: "Biochemistry", value:"BCH", program:"BS"},                           
    {label: "English", value:"ESL", program:"BA"},                           
    {label: "Manipuri", value:"MIL", program:"BA"},                           
    {label: "Economics", value:"ECO", program:"BA"},                           
    {label: "Geography", value:"GEG", program:"BA"},                           
    {label: "History", value:"HIS", program:"BA"} ,                          
    {label: "Philosophy", value:"PHI", program:"BA"},                           
    {label: "PolScience", value:"PSC", program:"BA"} ,                          
    {label: "Education", value:"EDN", program:"BA"}                           
  ]

  const sex = [
    {label: "M", value: "M"},
    {label: "F", value: "F"}
  ];

  const handleSubjectChange = (subject) => {
    console.log(subject);
    setProgram(subject.program);
    setHonoursSubject(subject.value);
  }

  const handleSexChange = (sex) => {
    setSex(sex.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let DOBdate = DOB.toLocaleDateString(undefined, {timeZone: 'Asia/Kolkata'});
    var DOBArray = DOBdate.split("/");
    var finalDOB = DOBArray[2] + "-" + DOBArray[0] + "-" + DOBArray[1];
    let DATEFORMDate = DATE_FORM_SUB.toLocaleDateString(undefined,{timeZone: 'Asia/Kolkata'});
    var DATEFORMArray = DATEFORMDate.split("/");
    var finalDATEFORM = DATEFORMArray[2] + "-" + DATEFORMArray[0] + "-" + DATEFORMArray[1];

    const student = {
        STUDENT_NAME,
        UHID,
        SEX,
        finalDATEFORM,
        PHOTO_URL,
        PRESENT_ADDRESS,
        PHONE_NO,
        PERMANENT_ADDRESS,
        FATHER_NAME,
        FATHER_OCCUPATION,
        MOTHER_NAME,
        MOTHER_OCCUPATION,
        ANNUAL_INCOME,
        CLAIM_FEE_EXEMPTION,
        finalDOB,
        AADHAR_NO,
        EMAIL_ID,
        STUDENT_MOBILE,
        CATEGORY,
        CLASS12_BOARD,
        CLASS12_ROLL,
        PASSOUT_YEAR,
        PROGRAM,
        SUB,
        EXM_ID,
        ENROLL_ID,
        UNIV_REG_ID,
        UNIV_EXM_ROLL
    }

    const response = await axiosPrivate.post(`/profile/`, {data: student})
    //const json = await response.json();
    //console.log(json);
    setInsertID(response.data);
    console.log(response.status)
    if(insertID !== ""){
      toast.success('Added Successfully!', {
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

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 mb-4">
        <h2 className="text-center mb-4">Add A Student</h2>

        <form onSubmit={handleSubmit}>
        <label>Student Name</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Name"
              name="STUDENT_NAME"
              value={STUDENT_NAME}
              onChange={(e) => setStudentName(e.target.value)}/>
          </div>
          <label>EXAM ID</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Exam ID"
              name="EXM_ID"
              value={EXM_ID}
              onChange={(e) => setEXMID(e.target.value)}
            />
          </div>
          <label>Enrollment ID</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Enrollment ID"
              name="ENROLL_ID"
              value={ENROLL_ID}
              onChange={(e) => setEnroll(e.target.value)}
            />
          </div>
          <label>University Registration ID</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter University Registration ID"
              name="UNIV_REG_ID"
              value={UNIV_REG_ID}
              onChange={(e) => setUnivReg(e.target.value)}
            />
          </div>
          <label>University Exam Roll</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter University Exam ID"
              name="UNIV_EXM_ROLL"
              value={UNIV_EXM_ROLL}
              onChange={(e) => setUnivExmRoll(e.target.value)}
            />
          </div>

          <label>SEX</label>
          <div className="form-group mt-3">
            <Select options={sex} onChange={handleSexChange}/>
          </div>
          <label>Date of Form Submission</label>
          <div className="form-group mt-3">
            <DatePicker onChange={setDateFormSub} value={DATE_FORM_SUB}/>
          </div>
          <label>Photo URL</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter photo URL"
              name="PHOTO_URL"
              value={PHOTO_URL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </div>
          <label>Present Address</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter present address"
              name="PRESENT_ADDRESS"
              value={PRESENT_ADDRESS}
              onChange={(e) => setPresentAddress(e.target.value)}
            />
          </div>
          <label>Phone Number</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter phone number"
              name="PHONE_NO"
              value={PHONE_NO}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>
          <label>Permanent Address</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter permanent address"
              name="PERMANENT_ADDRESS"
              value={PERMANENT_ADDRESS}
              onChange={(e) => setPermanentAddress(e.target.value)}
            />
          </div>
          <label>Father's Name</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter father's name"
              name="FATHER_NAME"
              value={FATHER_NAME}
              onChange={(e) => setFatherName(e.target.value)}
            />
          </div>
          <label>Father's Occupation</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter father's occupation"
              name="FATHER_OCCUPATION"
              value={FATHER_OCCUPATION}
              onChange={(e) => setFatherOccupation(e.target.value)}
            />
          </div>
          <label>Mother's Name</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter mother's name"
              name="MOTHER_NAME"
              value={MOTHER_NAME}
              onChange={(e) => setMotherName(e.target.value)}
            />
          </div>
          <label>Mother's Occupation</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter mother's occupation"
              name="MOTHER_OCCUPATION-NAME"
              value={MOTHER_OCCUPATION}
              onChange={(e) => setMotherOccupation(e.target.value)}
            />
          </div>
          <label>Annual Income</label>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter annual income"
              name="ANNUAL_INCOME"
              value={ANNUAL_INCOME}
              onChange={(e) => setAnnualIncome(parseInt(e.target.value))}
            />
          </div>
          <label>Claim for Fee Exemption?</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Claim for Fee Exemption?"
              name="CLAIM_FEE_EXEMPTION"
              value={CLAIM_FEE_EXEMPTION}
              onChange={(e) => setClaim(e.target.value)}
            />
          </div>
          <label>DOB</label>
          <div className="form-group mt-3">
            <DatePicker onChange={setDOB} value={DOB}/>
          </div>
          <div className="form-group mt-3">
          <label>Aadhar Number</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter aadhaar"
              name="AADHAR_NO"
              value={AADHAR_NO}
              onChange={(e) => setAadharNo(e.target.value)}
            />
          </div>
          <label>Email</label>
          <div className="form-group mt-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Email_id"
              name="EMAIL_ID"
              value={EMAIL_ID}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label>Student's Phone Number</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter student's phone number"
              name="STUDENT_MOBILE"
              value={STUDENT_MOBILE}
              onChange={(e) => setStudentPhoneNo(e.target.value)}
            />
          </div>
          <label>Category</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter category"
              name="CATEGORY"
              value={CATEGORY}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <label>Class 12 Board</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter class 12 Board"
              name="CLASS12_BOARD"
              value={CLASS12_BOARD}
              onChange={(e) => setClass12Board(e.target.value)}
            />
          </div>
          <label>Class 12 Roll Number</label>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter class 12 Roll number"
              name="CLASS12_ROLL"
              value={CLASS12_ROLL}
              onChange={(e) => setclass12Roll(e.target.value)}
            />
          </div>
          <label>Passout Year</label>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter passout year"
              name="PASSOUT_YEAR"
              value={PASSOUT_YEAR}
              onChange={(e) => setPassOutYear(parseInt(e.target.value))}
            />
          </div>
          <label>Honours Subject</label>
          <div className="form-group mt-3">
            <Select options={subjects} onChange={handleSubjectChange}/>
          </div>
          <button className="btn btn-primary btn-block mt-3">
            Add Student
          </button>
        </form>
      </div>
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
      {/* {(isAdmin == true && insertID !== null) ? <NewSubjectCombo id={insertID}/> : null} */}
    </div>
  );
};

export default Create;
