import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";

import Navbar from "./components/layouts/navbar";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Create from "./components/students/Create";
import Update from "./components/students/Update";
import View from "./components/students/View";
import SubjectsCombination from "./components/pages/SubjectsCombination";
import ExamFee from "./components/pages/ExamFee";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/studentProfile" element={<StudentProfile />} /> */}
          <Route path="/CreateStudentProfile" element={<Create />} />
          <Route path="/UpdateStudentProfile/:id" element={<Update />} />
          <Route path="/studentProfile/:id" element={<View />} />
          <Route path="/subjectsCombination" element={<SubjectsCombination />} />
          <Route path="/ExaminationFee" element={<ExamFee />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
