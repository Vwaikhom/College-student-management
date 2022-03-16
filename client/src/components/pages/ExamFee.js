import React, { useEffect, useState } from 'react';
import Pagination from '../layouts/pagination';

const ExamFee = () => {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    
    const loadStudents = async() => {
        const response = await fetch(`http://localhost:3001/ExaminationFee?page=${page}&npp=${perPage}`);
        const result = await response.json();
        console.log(result);
        setStudents(result.results)
        if(result.pagination.numberofPages !== undefined){
            setTotalPages(result.pagination.numberofPages);
          }
    }

    const handleChange = (student) => (e) => {
        const newList = students.map(ele => ele.ID === student.ID ? {...ele, [e.target.name] : e.target.value} : ele)
        setStudents(newList)
    }

    const handleUpdate = (student) => async(e) => {
      e.preventDefault();
      console.log(student);
      const response = await fetch(`http://localhost:3001/ExaminationFee/${student.ID}`, {
          method: 'PUT',
          headers:{"Content-type": "application/json"},
          body: JSON.stringify({"data" : student}) 
      });
      const result = await response.json();
      console.log(result);
      const updated = students.map(ele => ele.ID === student.ID ? {...ele, PAID : 'YES'} : ele)
      setStudents(updated);
    }

    useEffect(() => {
        loadStudents();
    }, [page])

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    }


    return (
    <div className="container-fluid">
      <Pagination perPage={perPage} numberofPages={totalPages} paginate = {paginate}/>
      <div className="d-grid gap-2 d-md-flex justify-content-left">
        <input type="text" name='search' placeholder='ID or Name'/>
      </div>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr className="table-dark">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">ID</th>
            <th scope="col">Paid?</th>
            <th scope="col">Phase</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{student.STUDENT_NAME}</td>
              <td>{student.ID}</td>
              <td>{student.PAID}</td>
              <td>
                <div className="d-grid gap-2 d-md-flex justify-content-left">
                    <input disabled={student.PHASE===0} type="number" name="PHASE" value={student.PHASE!==null?student.PHASE:0} onChange={handleChange(student)} />
                </div>
              </td>
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
 
export default ExamFee;