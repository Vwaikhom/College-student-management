import React, { useState, useEffect, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { useParams } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubjectWiseRecord = () => {

    const year = localStorage.getItem("currentYear");
    const {sem} = useParams();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [searchSubject, setSearchSubject] = useState("");
    const [students, setStudents] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const handleCheckChange = () => {
        setIsChecked(!isChecked);
    }

    const options = { 
        fieldSeparator: ',',
        filename: `Academic_records_semester${sem}_${year}`,
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: true,
        title: `Academic_records_semester${sem}_${year}`,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    useEffect(() => {
        loadStudents();
    },[page,year,sem]);

    const loadStudents = async() => {
        const result = await axiosPrivate.get(`/AcademicRecords/subjectWise/${year}/${sem}?page=${page}&npp=${perPage}`);
        console.log(result);
        setStudents(result.data.results)
        if(result.data.pagination.numberofPages !== undefined){
            setTotalPages(result.data.pagination.numberofPages);
          }
    }

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    const onChangeSearchSubject = (e) => {
        setSearchSubject(e.target.value);
    }

    const findBySubject = async() => {
        setPage(1);
        const result = await axiosPrivate.get(`/AcademicRecords/subjectWise/${year}/${sem}?title=${searchSubject}`);
        console.log(result);
        setStudents(result.data.results);
    }


    const handleMarkChange = (student) => (event) => {
        const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
        setStudents(newCombo)
    }

    const handleResultChange = (student) => (event) => {
        const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
        setStudents(newCombo)
    }
   
    const handleMarksUpdate = (student) => async() => {
        let result = await axiosPrivate.put(`/AcademicRecords/subjectWise/${year}/${sem}/${student.ID}`, {data:  student});
        console.log(result);
        if(result.statusText === "OK"){
            toast.success('Updated marks successfully!', {
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

    const handleBackRegister = (student) => async() => {
        let result = await axiosPrivate.post(`/BackStudents/back/${student.ID}`,{data: student});
        console.log(result);
        if(result.statusText === "OK"){
            toast.success('Registered as back successfully!', {
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

    const handleDownload = async() => {
        csvExporter.generateCsv(students);
    }

    return ( 
        <div className="container-fluid">
            <div className="d-grid gap-2 d-md-flex justify-content-center">
                <h1>{year} Academic Records  Sem: {sem}</h1>
            </div>
            <div className="col-sm-8">
                <div className="input-group mb-3 mt-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Subject"
                    value={searchSubject}
                    onChange={onChangeSearchSubject}
                />
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="backStudents" id="backStudents" checked={isChecked} onChange={handleCheckChange}/>
                    <label className="form-check-label" for="defaultCheck1">
                        Include Back Students
                    </label>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button
                    className="btn btn-outline-secondary ml-2"
                    type="button"
                    onClick={findBySubject}
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
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr className="table-dark">
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">ID</th>
                    <th scope="col">Current Semester</th>
                    <th scope="col">Academic Year</th>
                    <th scope="col">Course</th>
                    <th scope="col">Subject Code</th>
                    <th scope="col">IA</th>
                    <th scope="col">EA</th>
                    <th scope="col">Result</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student, index) => (
                    <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{student.STUDENT_NAME}</td>
                        <td>{student.ID}</td>
                        <td>{student.CURRENT_SEMESTER}</td>
                        <td>{student.SEM_YEAR}</td>
                        <td>{student.COURSE}</td>
                        <td>{student.SUB_CODE}</td>
                        <td>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                <input type="text" placeholder="IA" name = "IA" value={student.IA!==null ? student.IA : ""} onChange={handleMarkChange(student)} />  
                            </div>
                        </td>
                        <td>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                <input type="text" placeholder="EA" name = "EA" value={student.EA!==null ? student.EA : ""} onChange={handleMarkChange(student)} /> 
                            </div>
                        </td>
                        <td>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                <input type="text" placeholder="Result" name = "RESULT" value={student.RESULT} onChange={handleResultChange(student)} /> 
                            </div>
                        </td>
                        <td>
                            <button className='btn btn-primary mr-2' onClick={handleMarksUpdate(student)}>Update Marks</button>
                            <button className='btn btn-danger mr-2' onClick={handleBackRegister(student)}>Register as Back</button>
                        </td>
                    </tr>
                ))}
                </tbody>
        </table>
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
     );
}
 
export default SubjectWiseRecord;