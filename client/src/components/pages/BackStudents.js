import React, { useState, useEffect, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { AcademicYearContext } from '../../App';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ExportToCsv } from 'export-to-csv';

const BackStudents = () => {
    const state = useContext(AcademicYearContext);
    const {sem} = useParams();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [searchSubject, setSearchSubject] = useState("");
    const [students, setStudents] = useState([]);

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    const options = { 
        fieldSeparator: ',',
        filename: `BackStudents`,
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: true,
        title: `BackStudents`,
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
        const response = await fetch(`http://localhost:3001/BackStudents`);
        const result = await response.json();
        console.log(result);
        setStudents(result)
        if(result.pagination.numberofPages !== undefined){
            setTotalPages(result.pagination.numberofPages);
          }
    }

    const onChangeSearchSubject = (e) => {
        setSearchSubject(e.target.value);
    }

    const findBySubject = async() => {
        setPage(1);
        //console.log(searchTitle);

        let result = await fetch(`http://localhost:3001/BackStudents?subject=${searchSubject}`);
        //console.log(result);
        result = await result.json();

        setStudents(result);
    }

    const handleMarkChange = (student) => async(event) => {
        const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
        setStudents(newCombo)
    }

    const handleBackClear = (student) => async() => {
        let result = await fetch(`http://localhost:3001/BackStudents/${student.ID}?cleared=true`, {
            method: 'PUT',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({"data" : student})
        });
        result = await result.json();
        console.log(result);
    }

    const handleBackMarksUpdate = (student) => async() => {
        let result = await fetch(`http://localhost:3001/BackStudents/${student.ID}`, {
            method: 'PUT',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({"data" : student})
        });
        result = await result.json();
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
            <div className="col-sm-8">
                <div className="input-group mb-3 mt-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Subject"
                    value={searchSubject}
                    onChange={onChangeSearchSubject}
                />
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
            <div className="d-grid gap-2 d-md-flex mt-3">
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
                            <button className='btn btn-primary mr-2' onClick={handleBackMarksUpdate(student)}>Update Marks</button>
                            <button className='btn btn-success mr-2' onClick={handleBackClear(student)}>Back Cleared</button>
                        </td>
                    </tr>
                ))}
                </tbody>
        </table>
        </div>
    );
}
 
export default BackStudents;