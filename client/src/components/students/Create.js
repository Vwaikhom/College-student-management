import { useState } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import {Link} from 'react-router-dom';
import NewSubjectCombo from "../pages/NewSubjectCombo";

const Create = () => {
  const [STUDENT_NAME,setStudentName] = useState("");
  const [UHID,setUHID] = useState(null);
  const [SEX,setSex] = useState("");
  const [ROLL_NO, setRollNo] = useState("");
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
  const [UNIV_ROLL, setUnivRoll] = useState("");
  const [CLASS12_BOARD, setClass12Board] = useState("");
  const [CLASS12_ROLL, setclass12Roll] = useState("");
  const [PASSOUT_YEAR, setPassOutYear] = useState(0);
  const [DOB, setDOB] = useState(new Date());
  const [PROGRAM, setProgram] = useState("");
  const [SUB, setHonoursSubject] = useState("");
  const [isAdmin,setisAdmin] = useState(true);
  const [insertID,setInsertID] = useState(null);

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

  const handleSubjectChange = (subject) => {
    console.log(subject);
    setProgram(subject.program);
    setHonoursSubject(subject.value);
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
        SUB
    }

    const response = await fetch(`http://localhost:3001/profile/`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    })
    const json = await response.json();
    //console.log(json);
    setInsertID(json);
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 mb-4">
        <h2 className="text-center mb-4">Add A Student</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Name"
              name="STUDENT_NAME"
              value={STUDENT_NAME}
              onChange={(e) => setStudentName(e.target.value)}/>
          </div>

          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter UHID"
              name="UHID"
              value={UHID}
              onChange={(e) => setUHID(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter SEX"
              name="SEX"
              value={SEX}
              onChange={(e) => setSex(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <DatePicker onChange={setDateFormSub} value={DATE_FORM_SUB}/>
          </div>
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
          <div className="form-group mt-3">
            <Select options={subjects} onChange={handleSubjectChange}/>
          </div>
          <button className="btn btn-primary btn-block mt-3">
            Add Student
          </button>
        </form>
        {/* <div className="text-center mb-4">        
            <Link className="btn btn-primary" id="button" to="/AddSubjectCombination1">
                Add Subject Combination
            </Link>
        </div> */}
      </div>
      {(isAdmin == true && insertID !== null) ? <NewSubjectCombo id={insertID}/> : null}
    </div>
  );
};

export default Create;
