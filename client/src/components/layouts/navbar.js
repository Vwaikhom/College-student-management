import React, { useState } from "react";
import { Link,NavLink,useNavigate } from "react-router-dom";
import * as mdb from 'mdb-ui-kit';
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import "./Navbar.css";

const Navbar = () => {
  const year = localStorage.getItem("currentYear");
  const [thisYear,setThisYear] = useState("");
  const { auth, setAuth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const updateAcademicYear = (e) => {
    e.preventDefault();
    localStorage.clear();
    localStorage.setItem("currentYear", thisYear);
    window.location.reload();

  }

  const signOut = async () => {
    await logout();
    navigate('/Login');
  }

  return (
    // <AcademicYearContext.Consumer >
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
      {year}
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
                      <Link to={`/profile/${year}/1`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/1`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/1`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem2 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/2`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/2`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/2`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem3 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/3`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/3`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/3`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem4 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/4`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/4`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/4`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem5 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/5`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/5`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/5`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem6 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/6`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/6`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/6`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem7 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/7`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/7`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/7`}><button>Student subject combination</button></Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sem8 &raquo;
                  </a>
                  <ul className="dropdown-menu dropdown-submenu">
                    <li>
                      <Link to={`/profile/${year}/8`}><button>Student Profiles {(year)}</button></Link>
                    </li>
                    <li>
                    <Link to={`/academicRecords/${year}/8`}><button>Academic Records {(year)}</button></Link>
                    </li>
                    <li>
                      <Link to={`/subjectCombination/${year}/8`}><button>Student subject combination</button></Link>
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
                    <Link to={`/AdmissionFee/${year}/2`}><button>Semester2</button></Link>
                  </li>
                  <li>
                    <Link to={`/AdmissionFee/${year}/4`}><button>Semester4</button></Link>
                  </li>
                  <li>
                    <Link to={`/AdmissionFee/${year}/6`}><button>Semester6</button></Link>
                  </li>
                </ul>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Exam &raquo;
                </a>
                <ul className="dropdown-menu dropdown-submenu">
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/1`}><button>Semester1</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/2`}><button>Semester2</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/3`}><button>Semester3</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/4`}><button>Semester4</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/5`}><button>Semester5</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/6`}><button>Semester6</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/7`}><button>Semester7</button></NavLink>
                  </li>
                  <li>
                    <NavLink to={`/ExaminationFee/${year}/8`}><button>Semester8</button></NavLink>
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
                    <Link to={`/Promotion/${year}/1`}><button>1 to 2</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${year}/3`}><button>3 to 4</button></Link>
                  </li>
                  <li> 
                    <Link to={`/Promotion/${year}/5`}><button>5 to 6</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${year}/7`}><button>7 to 8</button></Link>
                  </li>
                </ul>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Even to Odd &raquo;
                </a>
                <ul className="dropdown-menu dropdown-submenu">
                <li>
                    <Link to={`/Promotion/${year}/2`}><button>2 to 3</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${year}/4`}><button>4 to 5</button></Link>
                  </li>
                  <li>
                    <Link to={`/Promotion/${year}/6`}><button>6 to 7</button></Link>
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
          <button onClick={signOut}>Logout</button>
      </li> 
        }
      </div>
    </nav>
  );
};

export default Navbar;
