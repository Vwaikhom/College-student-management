import React, { useState, useEffect, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { AcademicYearContext } from '../../App';
import { useParams } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import axios from "../../apis/api";

const AcademicRecords = () => {

    const state = useContext(AcademicYearContext);
    const {sem} = useParams();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [searchSubject, setSearchSubject] = useState("");
    const [students, setStudents] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckChange = () => {
        setIsChecked(!isChecked);
    }

    const options = { 
        fieldSeparator: ',',
        filename: `Academic_records_semester${sem}_${state.year}`,
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: true,
        title: `Academic_records_semester${sem}_${state.year}`,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    useEffect(() => {
        loadStudents();
    },[page,state.year]);

    const loadStudents = async() => {
        const result = await axios.get(`/AcademicRecords/${sem}/${state.year}?page=${page}&npp=${perPage}`);
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
        //console.log(searchTitle);
        let url = "";
        if(isChecked == true){
            url = `/SubjectWiseRecord/${sem}/${state.year}?subject=${searchSubject}&back=true`;
        } else{
            url = `/SubjectWiseRecord/${sem}/${state.year}?subject=${searchSubject}&back=false`;
        }
        const result = await axios.get(url);
        //console.log(result);
        setStudents(result.data.results);
    }

    // const handleChange = (student) => (event) => {
    //     const newCombo = students.map(ele => ele.ID === student.ID ? {...ele, [event.target.name] : event.target.value} : ele)
    //     setStudents(newCombo)
    // }

    const handleMarkChange = (student) => (event) => {
        const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
        setStudents(newCombo)
    }

    // const handleEAChange = (student) => (event) => {
    //     const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
    //     setStudents(newCombo)
    // }

    const handleResultChange = (student) => (event) => {
        const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
        setStudents(newCombo)
    }

    const handleMarksUpdate = (student) => async() => {
        let result = await axios.put(`/updateAcademicRecord/${sem}/${state.year}/${student.ID}`, {
            headers: {"Content-type": "application/json"},
            data:  student
        });
        //result = await result.json();
        console.log(result);
    }

    const handleBackRegister = (student) => async() => {
        let result = await axios.post(`/BackStudents/back/${student.ID}`,{
            headers: {"Content-type": "application/json"},
            data: student
        });
        //result = await result.json();
        console.log(result);
    }

    const handleDownload = async() => {
        //const result = await fetch(`http://localhost:3001/download/studentProfile/${sem}/${state.year}`);
        // const res = await result.json();
        // console.log(res);
        // setDownloadData(res);
        csvExporter.generateCsv(students);
    }

    return ( 
        <div className="container-fluid">
            <div className="d-grid gap-2 d-md-flex justify-content-center">
                <h1>{state.year} Academic Records  Sem: {sem}</h1>
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
                            {/* <button disabled={student.RESULT === "P"} className='btn btn-success mr-2' onClick={handleBackClear(student)}>Back Cleared</button> */}
                        </td>
                    </tr>
                ))}
                </tbody>
        </table>
        </div>
     );
}
 
export default AcademicRecords;