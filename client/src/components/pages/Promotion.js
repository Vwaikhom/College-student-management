import React, { useEffect, useState, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MUIPromote } from '../layouts/MUIPromote';

const Promotion = () => {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const year = localStorage.getItem("currentYear");
    const {sem} = useParams();
    const [fetchData, setFetchData] = useState(true);
    const [searchTitle, setSearchTitle] = useState("");

    const axiosPrivate = useAxiosPrivate();

    const triggerDataFetch = () => setFetchData(t => !t);

    const loadStudents = async() => {
        const response = await axiosPrivate.get(`/Promotion/${sem}/${year}?page=${page}&npp=${perPage}`);
        //const result = await response.json();
        console.log(response);
        setStudents(response.data.results)
        if(response.data.pagination.numberofPages !== undefined){
            setTotalPages(response.data.pagination.numberofPages);
          }
    }

    const handleDemote = (student) => async(e) => {
        e.preventDefault();
        console.log(student);
        let currSem = parseInt(sem) + 1;
        let currYear = parseInt(year);

        if(currSem % 2 !== 0){
          currYear = currYear + 1;  
        }

        const response = await axiosPrivate.post(`/Demotion/${currSem}/${currYear}/${student.ID}`,{ data: student});
        //const result = await response.json();
        console.log(response);
        triggerDataFetch();
      }

    useEffect(() => {
        loadStudents();
    }, [page,sem,year,fetchData])


    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    const onChangeSearchTitle = (e) => {
      setSearchTitle(e.target.value);
    }

    const findByTitle = async() => {
      setPage(1);
      console.log(searchTitle);
      const result = await axiosPrivate.get(`/Promotion/${sem}/${year}?title=${searchTitle}`);
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
        <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr className="table-dark">
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">ID</th>
              <th scope="col">ADMISSION FEE PAID?</th>
              <th scope="col">EXAM FEE PAID?</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) =>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{student.STUDENT_NAME}</td>
                <td>{student.ID}</td>
                <td>{student.ADM_FEE}</td>
                <td>{student.EXM_FEE}</td>
                <td>
                  { student.PROMOTED === 'N' ? <MUIPromote data={{'student':student,'sem':sem}}/> : <button className='btn btn-danger mr-2' onClick={handleDemote(student)}>Demote</button>}
                </td>
              </tr>
            ) }
          </tbody>
        </table>
        <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
      </div>
     );
}
 
export default Promotion;