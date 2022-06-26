import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import { createContext, useContext,useState } from "react";
import Navbar from "./components/layouts/navbar";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import NotFound from "./components/pages/NotFound";
import Create from "./components/students/Create";
import Update from "./components/students/Update";
import View from "./components/students/View";
import SubjectsCombination from "./components/pages/SubjectsCombination";
import ExamFee from "./components/pages/ExamFee";
import NewSubjectCombo from "./components/pages/NewSubjectCombo";
import AdmissionFee from "./components/pages/AdmissionFee";
import Promotion from "./components/pages/Promotion";
import AcademicRecords from "./components/pages/AcademicRecord";
import BackStudents from "./components/pages/BackStudents";
import Login from "./components/user/Login";
import RequireAuth from "./components/RequireAuth";
//import YearProvider from "./YearProvider";


export const AcademicYearContext = createContext({
  year: "",
  setYear: () => {}
});

export const App = () => {
  const [year,setYear] = useState(new Date().getFullYear());
  const value = { year, setYear };
  return (
    
    <Router>
      <div className="App">
      <AcademicYearContext.Provider value={value} >
        <Navbar />
        {/* <AcademicYearSwitcher /> */}
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/profile/:year/:sem" element={<Profile />} />
          <Route exact path="/profile/:year/:sem/:id" element={<View />} />
          <Route exact path="/academicRecords/:year/:sem" element={<AcademicRecords />} />
          <Route exact path="/BackStudents" element={<BackStudents />} />
          
          <Route path="/AddSubjectCombination1" element={<NewSubjectCombo />}/>
          {/* <Route path="/UpdateStudentProfile/:id" element={<Update />} /> */}
          {/* <Route path="/studentProfile/:id" element={<View />} /> */}
          <Route path="/subjectCombination/:year/:sem" element={<SubjectsCombination />} />

          <Route path="/Promotion/:year/:sem" element={<Promotion />} />
          <Route path="/Login" element={<Login />} />

          <Route element={<RequireAuth />} > 
            <Route path="/CreateStudentProfile" element={<Create />} />
            <Route path="/ExaminationFee/:year/:sem" element={<ExamFee />} />
            <Route path="/AdmissionFee/:year/:sem" element={<AdmissionFee />} />
            <Route exact path="/profile/:year/:sem/:id/update" element={<Update />} />
          </Route>
          
        </Routes>
        </AcademicYearContext.Provider>
      </div>
    </Router>
    
  );
};

export default App;
