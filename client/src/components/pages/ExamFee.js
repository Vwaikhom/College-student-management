import React, { useEffect, useState, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { AcademicYearContext } from '../../App';
import { useParams } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import axios from 'axios';

const ExamFee = () => {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const state = useContext(AcademicYearContext);
    const [searchTitle, setSearchTitle] = useState("");
    const {sem} = useParams();

    const options = { 
      fieldSeparator: ',',
      filename: `ExamFee_List_semester${sem}_${state.year}`,
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: `ExamFee_List_semester${sem}_${state.year}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
  
    const csvExporter = new ExportToCsv(options);


    const loadStudents = async() => {
        const response = await fetch(`http://localhost:3001/ExaminationFee/${sem}/${state.year}?page=${page}&npp=${perPage}`);
        const result = await response.json();
        console.log(result);
        setStudents(result.results)
        if(result.pagination.numberofPages !== undefined){
            setTotalPages(result.pagination.numberofPages);
          }
    }

    const handleChange = (student) => (e) => {
        const newList = students.map(ele => ele.STUDENT_ID === student.STUDENT_ID ? {...ele, [e.target.name] : e.target.value} : ele)
        setStudents(newList)
    }

    const handleUpdate = (student) => async(e) => {
      e.preventDefault();
      console.log(student);
      let flag = "";

      if(student.EXM_FEE_PHASE < 0){
        flag = "UNPAID";
      } else{
        flag = "PAID";
      }

      const response = await fetch(`http://localhost:3001/ExaminationFee/${sem}/${state.year}/${student.STUDENT_ID}`, {
          method: 'PUT',
          headers:{"Content-type": "application/json"},
          body: JSON.stringify(student) 
      });
      const result = await response.json();
      console.log(result);
      const updated = students.map(ele => ele.STUDENT_ID === student.STUDENT_ID ? {...ele, EXM_FEE : flag} : ele)
      setStudents(updated);
    }

    useEffect(() => {
        loadStudents();
    }, [page,sem,state.year])

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    const handleDownload = async() => {
      const result = await fetch(`http://localhost:3001/download/examFee/${sem}/${state.year}`);
      const res = await result.json();
      console.log(res);
      //setDownloadData(res);
      csvExporter.generateCsv(res);
    }

    const onChangeSearchTitle = (e) => {
      setSearchTitle(e.target.value);
    }

    const findByTitle = async() => {
      setPage(1);
      console.log(searchTitle);
      const result = await axios.get(`http://localhost:3001/ExaminationFee/${sem}/${state.year}?title=${searchTitle}`);
      console.log(result);
      setStudents(result.data.results);
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
      <div className="d-grid gap-2 d-md-flex mt-3">
        <button className="btn btn-primary mr-2" onClick={handleDownload}>Download</button>
      </div>
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
      <div className="d-grid gap-2 d-md-flex justify-content-left">
        <input type="text" name='search' placeholder='ID or Name'/>
      </div>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr className="table-dark">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">ID</th>
            <th scope="col">TOTAL PENDING BACK SUBJECTS</th>
            <th scope="col">Paid?</th>
            <th scope="col">Phase</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{student.STUDENT_NAME}</td>
              <td>{student.STUDENT_ID}</td>
              <td>{student.BACK_SUBS}</td>
              <td>{student.EXM_FEE}</td>
              <td>
                <div className="d-grid gap-2 d-md-flex justify-content-left">
                    <input disabled={student.EXM_FEE_PHASE===0} type="number" name="EXM_FEE_PHASE" value={student.EXM_FEE_PHASE!==null?student.EXM_FEE_PHASE:0} onChange={handleChange(student)} />
                </div>
              </td>
              <td>
                <button className='btn btn-primary mr-2' onClick={handleUpdate(student)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
    </div>
    );
}
 
export default ExamFee;