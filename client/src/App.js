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
import SubjectWiseRecord from "./components/pages/SubjectWiseRecord";
import StudentWiseRecord from "./components/pages/StudentWiseRecord";
import BackStudents from "./components/pages/BackStudents";
import Login from "./components/user/Login";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/pages/Unauthorized";
import PersistLogin from "./components/PersistLogin";

export const App = () => {
  return (
    
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/profile/:year/:sem" element={<Profile />} />
          <Route exact path="/profile/:year/:sem/:id" element={<View />} />

          <Route path="/Login" element={<Login />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["Admin","Editor"]}/>} > 
              <Route exact path="/academicRecords/studentWiseRecord/:year/:sem" element={<StudentWiseRecord />} />
              <Route exact path="/academicRecords/subjectWiseRecord/:year/:sem" element={<SubjectWiseRecord />} />
              <Route path="/CreateStudentProfile" element={<Create />} />
            </Route>
              
            <Route element={<RequireAuth allowedRoles={["Admin"]}/>} > 
              <Route exact path="/BackStudents" element={<BackStudents />} />
              <Route path="/AddSubjectCombination1" element={<NewSubjectCombo />}/>
              <Route path="/subjectCombination/:year/:sem" element={<SubjectsCombination />} />
              <Route path="/Promotion/:year/:sem" element={<Promotion />} />
              
              <Route path="/ExaminationFee/:year/:sem" element={<ExamFee />} />
              <Route path="/AdmissionFee/:year/:sem" element={<AdmissionFee />} />
              <Route exact path="/profile/:year/:sem/:id/update" element={<Update />} />
            </Route>
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
    </Router>
    
  );
};

export default App;
