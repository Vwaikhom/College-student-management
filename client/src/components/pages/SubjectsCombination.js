import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../layouts/pagination';
import { ExportToCsv } from 'export-to-csv';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SubjectsCombination = () => {
  const [studentSubjectCombo, setStudentSubjectCombo] = useState([]);
  //const [updatedCombo, setUpdatedCombo] = useState([]);
  const [page,setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages,setTotalPages] = useState(1);
  //const [downloaddata, setDownloadData] = useState([]);
  const year = localStorage.getItem("currentYear");
  const {sem} = useParams();
  const [searchTitle, setSearchTitle] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const options = { 
    fieldSeparator: ',',
    filename: `Subject_Combination_Semester${sem}_${year}`,
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: `Subject_Combination_Semester${sem}_${year}`,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

  const csvExporter = new ExportToCsv(options);

  useEffect(() => {
    LoadPage();
  }, [page,year,sem]);

  const LoadPage = async() => {
    const response = await axiosPrivate.get(`/subjectCombination/${year}/${sem}?page=${page}&npp=${perPage}`); 
    console.log(response);
    setStudentSubjectCombo(response.data.results);

    if(response.data.pagination.numberofPages !== undefined){
      setTotalPages(response.data.pagination.numberofPages);
    }
  };
  
  const findByTitle = async() => {
    setPage(1);
    console.log(searchTitle);
    const result = await axiosPrivate.get(`/subjectCombination/${year}/${sem}?title=${searchTitle}`);
    console.log(result);
    // const result = await axios.get(`http://localhost:3001/profile/${state.year}/${sem}?title=${searchTitle}`);
    setStudentSubjectCombo(result.data.results);
  }

  const paginate = (pageNumber) => {
    setPage(pageNumber);
  } 

  const onChangeSearchTitle = (e) => {
    setSearchTitle(e.target.value);
  }

  const handleChange = (student) => (event) => {
    const newCombo = studentSubjectCombo.map(ele => ele.ID === student.ID ? {...ele, [event.target.name] : event.target.value} : ele)
    setStudentSubjectCombo(newCombo)
  }


  const handleUpdate = (student) => async(event) => {
    event.preventDefault();
    console.log(student);
    //const formData = new FormData();
    //formData.append()
    const result = await axiosPrivate.post(`/subjectCombination/${year}/${sem}/${student.ID}`, {data:  student});

    //const response = await result.json();
    console.log(result);
  }

  const handleDownload = async() => {
    const result = await fetch(`/download/subjectCombination/${sem}/${year}`);
    const res = await result.json();
    // console.log(result);
    // setDownloadData(res);
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
            <th scope="col">Subject Combination</th>
          </tr>
        </thead>
        <tbody>
          {studentSubjectCombo.map((student, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{student.STUDENT_NAME}</td>
              <td>{student.ID}</td>
              <td>
                <div className="d-grid gap-2 d-md-flex justify-content-left">
                  { (sem === "5" || sem === "6" || sem === "7" || sem === "8" ) ? <input type="text" placeholder="DSE" name = "DSE" value={student.DSE!==null ? student.DSE : ""} onChange={handleChange(student)} />  : null}
                  { (sem === "3" || sem === "4" || sem === "5" || sem == "6" || sem === 7 || sem === "8") ?<input type="text" placeholder="GEC" name = "GEC" value={student.GEC!==null ? student.GEC : ""} onChange={handleChange(student)} />  : null}
                  {(sem === "1" || sem === "2") ? <input type="text" placeholder="AECC" name = "AECC" value={student.AECC!==null ? student.AECC : ""} onChange={handleChange(student)} />  : null}
                  {(sem === "1" || sem === "2")? <input type="text" placeholder="SEC" name = "SEC" value={student.SEC!==null ? student.SEC : ""} onChange={handleChange(student)} />  : null}
                  {(sem === "1" || sem === "2" || sem === "3" || sem === "4" || sem === "5" || sem === "6")?<input type="text" placeholder="VAC1" name = "VAC1" value={student.VAC1!==null ? student.VAC1 : ""} onChange={handleChange(student)} />  : null}
                  {(sem === "1" || sem === "2")?<input type="text" placeholder="VAC2" name = "VAC2" value={student.VAC2!==null ? student.VAC2 : ""} onChange={handleChange(student)} />  : null}
                  <button className='btn btn-primary mr-2' onClick={handleUpdate(student)}>Update</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
    </div>
  );
}
export default SubjectsCombination;