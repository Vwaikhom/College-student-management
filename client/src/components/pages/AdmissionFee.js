import React, { useEffect, useState, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { useParams } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const AdmissionFee = () => {

    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const year = localStorage.getItem("currentYear");
    const [searchTitle, setSearchTitle] = useState("");
    const {sem} = useParams();
    const axiosPrivate = useAxiosPrivate();

    const options = { 
      fieldSeparator: ',',
      filename: `AdmissionFee_List_semester${sem}_${year}`,
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: `AdmissionFee_List_semester${sem}_${year}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
  
    const csvExporter = new ExportToCsv(options);

    const loadStudents = async() => {
        const response = await axiosPrivate.get(`/AdmissionFee/${sem}/${year}?page=${page}&npp=${perPage}`);
        //const result = await response.json();
        console.log(response);
        setStudents(response.data.results)
        if(response.data.pagination.numberofPages !== undefined){
            setTotalPages(response.data.pagination.numberofPages);
          }
    }

    const onChangeSearchTitle = (e) => {
      setSearchTitle(e.target.value);
    }

    const findByTitle = async() => {
      setPage(1);
      console.log(searchTitle);
      const result = await axiosPrivate.get(`/AdmissionFee/${sem}/${year}?title=${searchTitle}`);
      console.log(result);
      setStudents(result.data.results);
    }

    const handleChange = (student) => (e) => {
        const newList = students.map(ele => ele.STUDENT_ID === student.STUDENT_ID ? {...ele, [e.target.name] : e.target.value} : ele)
        setStudents(newList)
    }

    const handleUpdate = (student) => async(e) => {
      e.preventDefault();
      let fee = {"flag": ""};

      if(student.ADM_FEE === 'PAID'){
        fee = {"flag":"UNPAID"};
      } else if(student.ADM_FEE === 'UNPAID'){
        fee = {"flag":"PAID"};
      }

      const newList = students.map(ele => ele.STUDENT_ID === student.STUDENT_ID ? {...ele, ADM_FEE : fee.flag} : ele)
      setStudents(newList)
      
      console.log(student);
      const response = await axiosPrivate.put(`/AdmissionFee/${sem}/${year}/${student.STUDENT_ID}`, {data: fee});
      //const result = await response.json();
      console.log(response);
      const updated = students.map(ele => ele.STUDENT_ID === student.STUDENT_ID ? {...ele, ADM_FEE : fee.flag} : ele)
      setStudents(updated);
    }

    useEffect(() => {
        loadStudents();
    }, [page,sem,year])

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    const handleDownload = async() => {
      const result = await fetch(`/download/admissionFee/${sem}/${year}`);
      const res = await result.json();
      console.log(res);
      //setDownloadData(res);
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
            <th scope="col">Paid?</th>
            {/* <th scope="col">Phase</th> */}
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{student.STUDENT_NAME}</td>
              <td>{student.STUDENT_ID}</td>
              <td>{student.ADM_FEE}</td>
              {/* <td>
                <div className="d-grid gap-2 d-md-flex justify-content-left">
                    <input disabled={student.ADM_FEE_PHASE===0} type="number" name="ADM_FEE_PHASE" value={student.ADM_FEE_PHASE!==null?student.ADM_FEE_PHASE:0} onChange={handleChange(student)} />
                </div>
              </td> */}
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
 
export default AdmissionFee;