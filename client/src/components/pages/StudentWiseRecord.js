import React, { useState, useEffect, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { useParams } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MUIMarks } from '../layouts/MUIMarks';

const StudentWiseRecord = () => {

    const year = localStorage.getItem("currentYear");
    const {sem} = useParams();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTitle, setSearchTitle] = useState("");
    const [students, setStudents] = useState({});
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
        const result = await axiosPrivate.get(`/AcademicRecords/studentWise/${year}/${sem}?page=${page}&npp=${perPage}`);
        console.log(result);
        setStudents(result.data.results)
        if(result.data.pagination.numberofPages !== undefined){
            setTotalPages(result.data.pagination.numberofPages);
          }
    }

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    const onChangeSearchTitle = (e) => {
        setSearchTitle(e.target.value);
    }

    const findByTitle = async() => {
        setPage(1);
        const result = await axiosPrivate.get(`/AcademicRecords/studentWise/${year}/${sem}?title=${searchTitle}`);
        console.log(result);
        setStudents(result.data.results);
    }

    // const handleMarkChange = (student) => (event) => {
    //     const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
    //     setStudents(newCombo)
    // }

    // const handleResultChange = (student) => (event) => {
    //     const newCombo = students.map(ele => ele.ID === student.ID && ele.SUB_CODE === student.SUB_CODE ? {...ele, [event.target.name] : event.target.value} : ele)
    //     setStudents(newCombo)
    // }

    // const handleMarksUpdate = (student) => async() => {
    //     let result = await axiosPrivate.put(`/updateAcademicRecord/${sem}/${year}/${student.ID}`, {data:  student});
    //     console.log(result);
    //     if(result.statusText === "OK"){
    //         toast.success('Updated marks successfully!', {
    //           position: "top-center",
    //           autoClose: 5000,
    //           hideProgressBar: false,
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: true,
    //           progress: undefined,
    //           });
    //       }
    // }

    // const handleBackRegister = (student) => async() => {
    //     let result = await axiosPrivate.post(`/BackStudents/back/${student.ID}`,{data: student});
    //     console.log(result);
    //     if(result.statusText === "OK"){
    //         toast.success('Registered as back successfully!', {
    //           position: "top-center",
    //           autoClose: 5000,
    //           hideProgressBar: false,
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: true,
    //           progress: undefined,
    //           });
    //       }
    // }

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
                    placeholder="Search by Title"
                    value={searchTitle}
                    onChange={onChangeSearchTitle}
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
            <table className="table table-bordered">
                <thead className="thead-dark">
                <tr className="table-dark">
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">College Rol Number</th>
                    <th scope="col">Subjects</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(students).map((ID, index) => (
                    <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{students[ID].STUDENT_NAME}</td>
                        <td><strong>{students[ID].COLLEGE_ROLL_NO}</strong></td>
                        <td>{students[ID].SUBJECTS.map((sub,index) => (
                            <><strong>{sub.SUB_CODE}</strong><br /></>    
                        ))}</td>
                        <td>
                            {/* <button className='btn btn-primary mr-2' onClick={handleMarksUpdate(ID)}>Update</button> */}
                            <MUIMarks data={{'student':students[ID], ID: ID, 'sem':sem , 'year': year}}/>
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
 
export default StudentWiseRecord;