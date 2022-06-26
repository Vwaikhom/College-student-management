import React, { useState, useContext, useEffect} from "react";
//import { AcademicYearContext } from "../../YearProvider";
//import { AcademicYearContext, YearProvider} from "../../YearProvider";
import { AcademicYearContext } from "../../App";
const Home = () => {

  //const { year, setYear } = useContext(AcademicYearContext);
  // const [thisyear,setThisYear] = useState('');

  // const updateYear = (e) => {
  //   setThisYear(e.target.value);
  // }

  // const updateAcademicYear = (e) => {
  //   e.preventDefault();
  //   setYear(thisyear);
  // }

  // const state = useContext(AcademicYearContext);
  // //const [academicYear,setAcademicYear] = useContext(AcademicYearContext);

  // return (
  //   <YearProvider>
  //     <div className="App">
  //       <h1>Manipur College Student Management</h1>
  //       <form onSubmit={updateAcademicYear}>
  //         <input type="text" name="year" value={thisyear} onChange={updateYear}/>
  //         <button className="btn btn-primary btn-sm">Choose Academic Year</button>
  //       </form>
  //       <h3>{year}</h3>
  //     </div>
  //   </YearProvider>

  // );

  //const { year, setYear } = useAcademicYear();
  //const state = useContext(AcademicYearContext);
  const state = useContext(AcademicYearContext);
  return (
      <h1>{state.year}</h1>
      // <button onClick={() => state.setYear('2021')}>
      //   Current Year: {state.year}
      // </button>
  )
};

export default Home;
