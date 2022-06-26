import React, { useEffect, useState, useContext } from 'react';
import Pagination from '../layouts/pagination';
import { AcademicYearContext } from '../../App';
import { useParams } from 'react-router-dom';

const Promotion = () => {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const state = useContext(AcademicYearContext);
    const {sem} = useParams();
    const [fetchData, setFetchData] = useState(true);

    const triggerDataFetch = () => setFetchData(t => !t);

    const loadStudents = async() => {
        const response = await fetch(`http://localhost:3001/Promotion/${sem}/${state.year}?page=${page}&npp=${perPage}`);
        const result = await response.json();
        console.log(result);
        setStudents(result.results)
        if(result.pagination.numberofPages !== undefined){
            setTotalPages(result.pagination.numberofPages);
          }
    }

    const handlePromote = (student) => async(e) => {
        e.preventDefault();
        console.log(student);
        const response = await fetch(`http://localhost:3001/Promotion/${sem}/${state.year}/${student.ID}`, {
            method: 'POST',
            headers:{"Content-type": "application/json"},
            body: JSON.stringify(student) 
        });
        const result = await response.json();
        console.log(result);
        //setStudents({ ...students, })
        triggerDataFetch();
      }

    const handleDemote = (student) => async(e) => {
        e.preventDefault();
        console.log(student);
        let currSem = parseInt(sem) + 1;
        let currYear = parseInt(state.year);

        if(currSem % 2 !== 0){
          currYear = currYear + 1;  
        }

        const response = await fetch(`http://localhost:3001/Demotion/${currSem}/${currYear}/${student.ID}`, {
            method: 'POST',
            headers:{"Content-type": "application/json"},
            body: JSON.stringify(student) 
        });
        const result = await response.json();
        console.log(result);
        triggerDataFetch();
      }

    useEffect(() => {
        loadStudents();
    }, [page,sem,state.year,fetchData])


    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }

    return ( 
        <div className="container-fluid">
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
                  { student.PROMOTED === 'N' ? <button className='btn btn-primary mr-2' onClick={handlePromote(student)}>Promote</button> : <button className='btn btn-danger mr-2' onClick={handleDemote(student)}>Demote</button>}
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