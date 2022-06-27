import React, { useState, useEffect,useContext } from "react";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import Pagination from "../layouts/pagination";
import { AcademicYearContext } from "../../App";
import { ExportToCsv } from 'export-to-csv';
import axios from '../../apis/api';

const Profile = () => {
  const [studentList, setStudentList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");


  const state = useContext(AcademicYearContext);
  const {sem} = useParams();


  useEffect(() => {
    loadStudents();
  }, [page,state.year,sem]);

  const options = { 
    fieldSeparator: ',',
    filename: 'Student_profiles',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'Student Profiles',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(options);


  const loadStudents = async () => {
    const studentResult = await axios.get(`/profile/${state.year}/${sem}?page=${page}&npp=${perPage}&title=${searchTitle}`);
    console.log(studentResult);
    setStudentList(studentResult.data.results);
    if(studentResult.data.pagination.numberofPages !== undefined){
      setTotalPages(studentResult.data.pagination.numberofPages);
    }
  };

  const paginate = (pageNumber) => {
    setPage(pageNumber);
  }

  const onChangeSearchTitle = (e) => {
    setSearchTitle(e.target.value);
  }
   
  const findByTitle = async() => {
    setPage(1);
    console.log(searchTitle);
    const result = await axios.get(`/profile/${state.year}/${sem}?title=${searchTitle}`);
    setStudentList(result.data.results);
  }
  
  const handleDownload = async() => {
    const result = await fetch(`/download/studentProfile/${sem}/${state.year}`);
    const res = await result.json();
    //console.log(res);
    csvExporter.generateCsv(res);
  }
  return (
    <div className="container-fluid">
      <div className="col-sm-8">
        <div className="input-group mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <button
              className="btn btn-outline-secondary ml-2"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="d-grid gap-2 d-md-flex">
        <button className="btn btn-primary mr-2" onClick={handleDownload}>Download</button>
      </div>
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
      <table className="table border shadow">
        <thead className="thead-dark">
          <tr className="table-dark">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Roll Number</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Email</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((student, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{student.STUDENT_NAME}</td>
              <td>{student.ROLL_NO}</td>
              <td>{student.STUDENT_MOBILE}</td>
              <td>{student.EMAIL_ID}</td>
              <td>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Link to={`/profile/${state.year}/${sem}/${student.ID}`}><button className="btn btn-primary mr-2">View</button></Link>
                  <Link to={`/profile/${state.year}/${sem}/${student.ID}/update`}><button className="btn btn-success ml-2">Edit</button></Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
    </div>
  );
};

export default Profile;
