import React from "react";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const year = localStorage.getItem("currentYear");

  return (
      <div>      
        {!year ? <h1>Please set academic first</h1> : <h1>{year}</h1>}
      </div>

  )
};

export default Home;
