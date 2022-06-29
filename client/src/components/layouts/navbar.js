import React, {useContext, useState} from "react";
import { Link,NavLink } from "react-router-dom";
import * as mdb from 'mdb-ui-kit';
import { AcademicYearContext } from "../../App";
import useAuth from "../../hooks/useAth";
import Cookies from "js-cookie";

import "./Navbar.css";

const Navbar = () => {
  const state = useContext(AcademicYearContext);
  const [thisYear,setThisYear] = useState("");
  const { auth, setAuth } = useAuth();

  const updateAcademicYear = (e) => {
    e.preventDefault();
    state.setYear(thisYear);
  }

  const logout = () => {
    setAuth({});
    Cookies.remove("userId", {path:"/", domain:"localhost"});
    localStorage.clear();
  }

  return (
    // <AcademicYearContext.Consumer >
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
      {state.year}
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item " style={{ paddingTop: 8}}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none'}}>Home</Link>
          </li>
          <li className="nav-item">
            <div className="dropdown">
            {/* <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-mdb-toggle="dropdown" aria-expanded="false">Semester</button> */}
            <a href="#" id="menu" data-toggle="dropdown" class="nav-link dropdown-toggle w-100">Semester</a>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <a className="dropdown-item" href="#">
                    Sem1 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/1`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/1`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/1`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem2 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/2`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/2`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/2`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem3 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/3`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/3`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/3`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem4 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/4`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/4`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/4`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem5 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/5`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/5`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/5`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem6 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/6`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/6`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/6`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem7 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/7`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/7`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/7`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem8 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${state.year}/8`}><button>Student Profiles {(state.year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${state.year}/8`}><button>Academic Records {(state.year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${state.year}/8`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>

          <div className="dropdown">
            {/* <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-mdb-toggle="dropdown" aria-expanded="false">Fee</button> */}
            <a href="#" id="menu" data-toggle="dropdown" class="nav-link dropdown-toggle w-100">Fee</a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <a className="dropdown-item" href="#">
                  Admission &raquo;
                </a>
                <ul className="dropdown-menu dropdown-submenu">
                  <li>
                    <Link to={`/AdmissionFee/${state.year}/2`}><button>Semester2</button></Link>
                  </li>
                  <li>
                    <Link to={`/AdmissionFee/${state.year}/4`}><button>Semester4</button></Link>
                  </li>
                  <li>
                    <Link to={`/AdmissionFee/${state.year}/6`}><button>Semester6</button></Link>
                  </li>
                </ul>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Exam &raquo;
                </a>
                <ul className="dropdown-menu dropdown-submenu">
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/1`}><button>Semester1</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/2`}><button>Semester2</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/3`}><button>Semester3</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/4`}><button>Semester4</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/5`}><button>Semester5</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/6`}><button>Semester6</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/7`}><button>Semester7</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${state.year}/8`}><button>Semester8</button></NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            {/* <button className="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton" data-mdb-toggle="dropdown" aria-expanded="false">Promotion</button> */}
            <a href="#" id="menu" data-toggle="dropdown" class="nav-link dropdown-toggle w-100">Promotion</a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <a className="dropdown-item" href="#">
                  Odd to Even &raquo;
                </a>
                <ul className="dropdown-menu dropdown-submenu">
                  <li>
                    <Link to={`/Promotion/${state.year}/1`}><button>1 to 2</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${state.year}/3`}><button>3 to 4</button></Link>
                  </li>
                  <li> 
                    <Link to={`/Promotion/${state.year}/5`}><button>5 to 6</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${state.year}/7`}><button>7 to 8</button></Link>
                  </li>
                </ul>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Even to Odd &raquo;
                </a>
                <ul className="dropdown-menu dropdown-submenu">
                <li>
                    <Link to={`/Promotion/${state.year}/2`}><button>2 to 3</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${state.year}/4`}><button>4 to 5</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${state.year}/6`}><button>6 to 7</button></Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* <li className="nav-item active d-flex flex-row">
             <Link to="/BackStudents"><button type="button" className="btn btn-primary btn-sm">Back Students</button></Link> 
            <Link to="/BackStudents"><a href="#" id="menu" data-toggle="dropdown" class="nav-link dropdown-toggle w-100">Back Students</a></Link>
          </li> */}
          <li className="nav-item " style={{ paddingTop: 8}}>
            <Link to="/BackStudents" style={{ color: 'white', textDecoration: 'none'}}>BackStudents</Link>
          </li>
          <li className="nav-item">
            <Link to="/createStudentProfile"><button className="btn btn-outline-light">Add Student</button></Link>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0" onSubmit={updateAcademicYear}> 
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => setThisYear(e.target.value)}
          />
          <button className="btn btn-outline-success my-2 my-sm-1">
            Change Academic Year
          </button>
        </form>
        {!(auth?.user) ? 
        <li className="nav-item " style={{ paddingTop: 8}}>
          <Link to="/Login" style={{ color: 'white', textDecoration: 'none'}}>Login</Link>
        </li>
        :
        <li className="nav-item active d-flex flex-row">
          <button onClick={logout}>Logout</button>
      </li> 
        }
      </div>
    </nav>
  );
};

export default Navbar;
