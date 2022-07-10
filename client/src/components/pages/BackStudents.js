import React, { useState, useEffect, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ExportToCsv } from 'export-to-csv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BackStudents = () => {
    const year = localStorage.getItem("currentYear");
    const {sem} = useParams();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [students, setStudents] = useState([]);
    const axiosPrivate = useAxiosPrivate();

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
    },[page,year]);

    const loadStudents = async() => {
        const response = await axiosPrivate.get(`/BackStudents`);
        console.log(response);
        setStudents(response.data)
        // if(response.pagination.numberofPages !== undefined){
        //     setTotalPages(response.pagination.numberofPages);
        // }
    }

    const onChangeSearchName = (e) => {
        setSearchName(e.target.value);
    }

    const findByName = async() => {
        setPage(1);
        //console.log(searchTitle);

        let result = await axiosPrivate.get(`/BackStudents?name=${searchName}`);
        console.log(result);
        //result = await result.json();

        setStudents(result.data);
    }

    const handleMarkChange = (student) => async(event) => {
        const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
        setStudents(newCombo)
    }

    const handleBackClear = (student) => async() => {
        let result = await axiosPrivate.put(`/BackStudents/${student.ID}?cleared=true`, { data:  student});
        //result = await result.json();
        console.log(result);
        if(result.statusText === "OK"){
            toast.success('Cleared from back list successfully!', {
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

    const handleBackMarksUpdate = (student) => async() => {
        let result = await axiosPrivate.put(`/BackStudents/${student.ID}`, { data:  student});
        //result = await result.json();
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
                    value={searchName}
                    onChange={onChangeSearchName}
                />
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button
                    className="btn btn-outline-secondary ml-2"
                    type="button"
                    onClick={findByName}
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
 
export default BackStudents;