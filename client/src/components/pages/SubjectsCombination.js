import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../layouts/pagination';

const SubjectsCombination = () => {
  const [studentSubjectCombo, setStudentSubjectCombo] = useState([]);
  //const [updatedCombo, setUpdatedCombo] = useState([]);
  const [page,setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages,setTotalPages] = useState(1);

  useEffect(() => {
    LoadPage();
  }, [page]);

  const LoadPage = async() => {
    const response = await fetch(`http://localhost:3001/studentSubjectCombination?page=${page}&npp=${perPage}`);
    const result = await response.json(); 
    console.log(result);
    setStudentSubjectCombo(result.results);

    if(result.pagination.numberofPages !== undefined){
      setTotalPages(result.pagination.numberofPages);
    }
  };
  
  const paginate = (pageNumber) => {
    setPage(pageNumber);
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
    const result = await fetch(`http://localhost:3001/subjectsUpdate/${student.ID}`, {
      method: 'POST',
      headers:{"Content-type": "application/json"},
      body: JSON.stringify({"data" : student}) 
    });

    const response = await result.json();
    console.log(response);
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
                  <input type="text" name = "SUB_CODE1" value={student.SUB_CODE1!==null ? student.SUB_CODE1 : ""} onChange={handleChange(student)} />  
                  <input type="text" name = "SUB_CODE2" value={student.SUB_CODE2!==null ? student.SUB_CODE2 : ""} onChange={handleChange(student)} />  
                  <input type="text" name = "SUB_CODE3" value={student.SUB_CODE3!==null ? student.SUB_CODE3 : ""} onChange={handleChange(student)} />  
                  <input type="text" name = "SUB_CODE_FC" value={student.SUB_CODE_FC!==null ? student.SUB_CODE_FC : ""} onChange={handleChange(student)} />  
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

// const SubjectsCombination = () => {
//     const  {id}  = useParams();
//     console.log(id);
//     const [subjects, setSubjects] = useState({
//         SUB_CODE1: "",
//         SUB_CODE2: "",
//         SUB_CODE3: "",
//         SUB_CODE_FC: ""
//     });

//     const {
//         SUB_CODE1,
//         SUB_CODE2,
//         SUB_CODE3,
//         SUB_CODE_FC
//     } = subjects;

//     useEffect(() => {
//         LoadSubjects();
//     },[])

//     const LoadSubjects = async() => {
//         const response = await fetch(`http://localhost:3001/subjects/${id}`);
//         const result = await (response.json());
//         console.log(result);
//         setSubjects(result);
//     }

//     const onInputChange = e => {
//         setSubjects({ ...subjects, [e.target.name]: e.target.value });
//       };

//     const onSubmit = async e => {
//         e.preventDefault();
//         console.log(subjects);
//         const result = await fetch(`http://localhost:3001/subjectsUpdate/${id}`, {
//             method: 'POST',
//             headers:{"Content-type": "application/json"},
//             body: JSON.stringify({"data" : subjects})
//         });
//         console.log(result);
//     };

//     return(
//         <div className="container">
//         <div className="w-75 mx-auto shadow p-5">
//           <h2 className="text-center mb-4">Student Id: {id}</h2>
  
//           <form onSubmit={e => onSubmit(e)}>
//             <div className="form-group mt-3">
//               <input
//                 type="text"
//                 className="form-control form-control-lg"
//                 placeholder="Enter Subject Code 1"
//                 name="SUB_CODE1"
//                 value={SUB_CODE1}
//                 onChange={e => onInputChange(e)}/>
//             </div>
  
//             <div className="form-group mt-3">
//               <input
//                 type="text"
//                 className="form-control form-control-lg"
//                 placeholder="Enter Subject Code 2"
//                 name="SUB_CODE2"
//                 value={SUB_CODE2}
//                 onChange={e => onInputChange(e)}
//               />
//             </div>
//             <div className="form-group mt-3">
//               <input
//                 type="text"
//                 className="form-control form-control-lg"
//                 placeholder="Enter Subject Code 3"
//                 name="SUB_CODE3"
//                 value={SUB_CODE3}
//                 onChange={e => onInputChange(e)}
//               />
//             </div>
//             <div className="form-group mt-3">
//               <input
//                 type="text"
//                 className="form-control form-control-lg"
//                 placeholder="Enter Subject Code FC"
//                 name="SUB_CODE_FC"
//                 value={SUB_CODE_FC}
//                 onChange={e => onInputChange(e)}
//               />
//             </div>
//             <button className="btn btn-primary btn-block mt-3">
//               Update
//             </button>
//           </form>
//         </div>
//       </div>
//     );
// }
 
export default SubjectsCombination;