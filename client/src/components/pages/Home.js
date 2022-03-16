import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import Pagination from "../layouts/pagination";

const Home = () => {
  const [studentList, setStudentList] = useState([]);
  const [filteredStudent, setFilteredStudent] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    loadStudents();
  }, [page]);

  const loadStudents = async () => {
    const studentResult = await axios.get(
      `http://localhost:3001/studentProfile?page=${page}&npp=${perPage}`
    );
    console.log(studentResult);
    setStudentList(studentResult.data.results);
    //setFilteredStudent(studentResult.data);
    if(studentResult.data.pagination.numberofPages !== undefined){
      setTotalPages(studentResult.data.pagination.numberofPages);
    }
  };

  // useEffect(() => {
  //   setFilteredStudent(
  //     studentList.filter( student => {
  //       if(search == ""){
  //         return studentList;
  //       } else{
  //         return student.ID == search;
  //       }
  //     })
  //   )
  // },[search]);

  const paginate = (pageNumber) => {
    setPage(pageNumber);
  }

  return (
    <div className="container-fluid">
      {/* <input
        type="text"
        placeholder="Search"
        onChange={(event) => setSearch(event.target.value)}
      /> */}
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
                  <NavLink
                    className="btn btn-primary mr-2"
                    to={`/studentProfile/${student.ID}`}
                  >
                    View
                  </NavLink>
                  <NavLink
                    className="btn btn-success mr-2"
                    to={`/UpdateStudentProfile/${student.ID}`}
                  >
                    Edit
                  </NavLink>
                  {/* <Link className="btn btn-secondary mr-2" to={`/subjectsCombination/${student.ID}`}>
                    Add or Edit Subject Combination
                  </Link> */}
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

export default Home;
