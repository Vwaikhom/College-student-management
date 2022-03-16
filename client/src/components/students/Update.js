import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Update = () => {
  //let history = useHistory();

  const { id } = useParams();
  //const [previousStudent, setPreviousStudent] = useState({});

  const [student, setStudent] = useState({
    STUDENT_NAME: "",
    UHID: "",
    ROLL_NO: "",
    SEX: "",
    DATE_FORM_SUB: "",
    PHOTO_URL: "",
    PRESENT_ADDRESS: "",
    PHONE_NO: "",
    PERMANENT_ADDRESS: "",
    FATHER_NAME: "",
    FATHER_OCCUPATION: "",
    MOTHER_NAME: "",
    MOTHER_OCCUPATION: "",
    ANNUAL_INCOME: "",
    CALIM_FEE_EXEMPTION: "",
    DOB: "",
    AADHAR_NO: "",
    EMAIL_ID: "",
    STUDENT_MOBILE: "",
    CATEGORY: "",
    UNIV_ROLL: "",
    CLASS12_BOARD: "",
    CLASS12_ROLL: "",
    PASSOUT_YEAR: "",
  });

  const { 
        STUDENT_NAME,
        UHID,
        ROLL_NO,
        SEX,
        DATE_FORM_SUB,
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
        DOB,
        AADHAR_NO,
        EMAIL_ID,
        STUDENT_MOBILE,
        CATEGORY,
        UNIV_ROLL,
        CLASS12_BOARD,
        CLASS12_ROLL,
        PASSOUT_YEAR, } = student;

  const onInputChange = e => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    LoadStudent();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    const updateResult = await axios.put(`http://localhost:3001/updateStudentProfile/${id}`, student);
    console.log(updateResult);
    //history.push("/");
  };

  const LoadStudent = async () => {
    const result = await axios.get(`http://localhost:3001/updateStudentProfile/${id}`);
    setStudent(result.data[0]);
    //console.log(result);
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
              value={STUDENT_NAME}
              onChange={e => onInputChange(e)}/>
          </div>

          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter UHID"
              name="UHID"
              value={UHID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter Roll Number"
              name="ROLL_NO"
              value={ROLL_NO}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter SEX"
              name="SEX"
              value={SEX}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Date of form submission"
              name="DATE_FORM_SUB"
              value={DATE_FORM_SUB}
              onChange={e => onInputChange(e)}
            />
          </div>
         <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter photo URL"
              name="PHOTO_URL"
              value={PHOTO_URL}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter present address"
              name="PRESENT_ADDRESS"
              value={PRESENT_ADDRESS}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter phone number"
              name="PHONE_NO"
              value={PHONE_NO}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter permanent address"
              name="PERMANENT_ADDRESS"
              value={PERMANENT_ADDRESS}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter father's name"
              name="FATHER_NAME"
              value={FATHER_NAME}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter father's occupation"
              name="FATHER_OCCUPATION"
              value={FATHER_OCCUPATION}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter mother's name"
              name="MOTHER_NAME"
              value={MOTHER_NAME}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter mother's occupation"
              name="MOTHER_OCCUPATION-NAME"
              value={MOTHER_OCCUPATION}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter annual income"
              name="ANNUAL_INCOME"
              value={ANNUAL_INCOME}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Claim for Fee Exemption?"
              name="CLAIM_FEE_EXEMPTION"
              value={CLAIM_FEE_EXEMPTION}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter DOB"
              name="DOB"
              value={DOB}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter aadhaar"
              name="AADHAR_NO"
              value={AADHAR_NO}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Email_id"
              name="EMAIL_ID"
              value={EMAIL_ID}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter student's phone number"
              name="STUDENT_MOBILE"
              value={STUDENT_MOBILE}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter category"
              name="CATEGORY"
              value={CATEGORY}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter university roll Number"
              name="UNIV_ROLL"
              value={UNIV_ROLL}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter class 12 Board"
              name="CLASS12_BOARD"
              value={CLASS12_BOARD}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter class 12 Roll number"
              name="CLASS12_ROLL"
              value={CLASS12_ROLL}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Enter passout year"
              name="PASSOUT_YEAR"
              value={PASSOUT_YEAR}
              onChange={e => onInputChange(e)}
            />
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
