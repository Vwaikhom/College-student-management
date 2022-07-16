import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./View.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const View = () => {
  const { course,sem,id } = useParams();
  const [student, setStudent] = useState({});
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    LoadStudent();
  }, []);

  const LoadStudent = async () => {
    console.log(course,id);
    const studentResult = await axiosPrivate.get(
      `/profile/${course}/${sem}/${id}`
    );
    setStudent(studentResult.data[0]);
  };

  console.log(student);
  return (
    <div className="container py-4" id="center">
      <img src = {student.PHOTO_URL} className = "student-image" alt="" />
      <h1 className="display-4">User Id: {id}</h1>
      <hr />
      <ul className="list-group w-50" id="center">
        <li className="list-group-item">
          <b>Name:</b> {student.STUDENT_NAME}
        </li>
        <li className="list-group-item">
          <b>Roll Number:</b> {student.COLLEGE_ROLL_NO}
        </li>
        <li className="list-group-item">
          <b>Enrollment ID:</b> {student.ENROLLMENT_ID}
        </li>
        <li className="list-group-item">
          <b>DOB:</b> {student.DOB}
        </li>
        <li className="list-group-item">
          <b>Email:</b> {student.EMAIL_ID}
        </li>
        <li className="list-group-item">
          <b>Phone Number:</b> {student.STUDENT_MOBILE}
        </li>
        <li className="list-group-item">
          <b>Address:</b> {student.PRESENT_ADDRESS}
        </li>
        <li className="list-group-item">
          <b>Fathe's Name:</b> {student.FATHER_NAME}
        </li>
        <li className="list-group-item">
          <b>Father's Occupation:</b> {student.FATHER_OCCUPATION}
        </li>
        <li className="list-group-item">
          <b>Mother's Name:</b> {student.MOTHER_NAME}
        </li>
        <li className="list-group-item">
          <b>Mother's Occupation:</b> {student.MOTHER_OCCUPATION}
        </li>
        <li className="list-group-item">
          <b>Annual Income:</b> {student.ANNUAL_INCOME}
        </li>
        <li className="list-group-item">
          <b>Claim for Fee Exemption:</b> {student.CLAIM_FEE_EXEMPTION}
        </li>
        <li className="list-group-item">
          <b>AADHAR Number:</b> {student.AADHAR_NO}
        </li>
        <li className="list-group-item">
          <b>Class 12 Board:</b> {student.CLASS12_BOARD}
        </li>
        <li className="list-group-item">
          <b>Class 12 Roll Number:</b> {student.CLASS12_ROLL}
        </li>
        <li className="list-group-item">
          <b>Passout Year:</b> {student.PASSOUT_YEAR}
        </li>
        <li className="list-group-item">
          <b>Honours Subject:</b> {student.SUB}
        </li>
        <li className="list-group-item">
          <b>Course:</b> {student.COURSE}
        </li>
      </ul>

      <Link className="btn btn-primary" id="button" to="/">
        back to Home
      </Link>
    </div>
  );
};

export default View;
