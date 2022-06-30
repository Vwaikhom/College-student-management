import React, { useState, useContext, useEffect} from "react";
//import { AcademicYearContext } from "../../YearProvider";
//import { AcademicYearContext, YearProvider} from "../../YearProvider";
import { AcademicYearContext } from "../../App";
import '../layouts/MUIDialog';
// import { MUIDialog } from "../layouts/MUIDialog";
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const state = useContext(AcademicYearContext);

  // const notify = () => {
  //   toast.success('Wow so easy!', {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     });
  // }

  return (
      <div>      
        <h1>{state.year}</h1>
        {/* {<MUIDialog />} */}
        {/* <button onClick={notify}>Notify</button> */}
        {/* <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
      </div>

  )
};

export default Home;
