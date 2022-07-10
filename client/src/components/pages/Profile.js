import React, { useState, useEffect,useContext } from "react";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import Pagination from "../layouts/pagination";
import { ExportToCsv } from 'export-to-csv';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import '../layouts/MUIDialog';
import { MUIDialog } from "../layouts/MUIDialog";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const [studentList, setStudentList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [toggle, setToggle] = useState(true);
  const refresh = useRefreshToken();
  const year = localStorage.getItem("currentYear");
  const {sem} = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const controller = new AbortController();
  
  useEffect(() => {
    loadStudents();
  }, [page,year,sem,toggle]);

  const options = { 
    fieldSeparator: ',',
    filename: `Student_profiles${sem}_${year}`,
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: `Student_profiles${sem}_${year}`,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(options);


  const loadStudents = async () => {
    try{
      const studentResult = await axiosPrivate.get(`/profile/${year}/${sem}?page=${page}&npp=${perPage}&title=${searchTitle}`,{
        signal: controller.signal
      });
      console.log(studentResult);
      setStudentList(studentResult.data.results);
      if(studentResult.data.pagination.numberofPages !== undefined){
        setTotalPages(studentResult.data.pagination.numberofPages);
      }
    }
    catch(error){
      console.log(error);
      navigate('/Login',{ state: { from: location }, replace: true});
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
    const result = await axiosPrivate.get(`/profile/${year}/${sem}?title=${searchTitle}`);
    setStudentList(result.data.results);
  }
  
  const handleDownload = async() => {
    const result = await fetch(`/download/studentProfile/${sem}/${year}`);
    const res = await result.json();
    //console.log(res);
    csvExporter.generateCsv(res);
  };

  // const handleDelete = (student) => async() => {
  //   // console.log(student);
  //   // const result = await axios.delete(`/profile/${state.year}/${sem}/${student.ID}`);
  //   // console.log(result);
  //   // setToggle(!toggle);
  //   <MUIDialog></MUIDialog>
  // }

  // const openDialog = () => {
  //   return(
  //     <MUIDialog />
  //   );
  // };

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
                  <Link to={`/profile/${year}/${sem}/${student.ID}`}><button className="btn btn-primary mr-2">View</button></Link>
                  <Link to={`/profile/${year}/${sem}/${student.ID}/update`}><button className="btn btn-success ml-2">Edit</button></Link>
                  {/* <button className="btn btn-danger ml-2" onClick={openDialog}>Delete</button> */}
                  {<MUIDialog data={{'student':student,'sem':sem}}/>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
};

export default Profile;
