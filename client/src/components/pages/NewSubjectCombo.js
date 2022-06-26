import React, { useState } from 'react';
const NewSubjectCombo =  (props) => {
    const [coreCoursePaper1, setCC1] = useState("");
    const [coreCoursePaper2, setCC2] = useState("");
    const [aecc,setaecc] = useState("");
    const [sec,setsec] = useState("");
    const [vac1,setvac1] = useState("");
    const [vac2,setvac2] = useState("");

    const id = props.id;
    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        const subjects = {
            aecc,
            sec,
            vac1,
            vac2,
            id
        };
        console.log(subjects);
        const response = await fetch(`http://localhost:3001/addSubjectCombination`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },    
            body: JSON.stringify(subjects)
        });
        console.log(response);
    }

    return (
        <div className="container">
            <div className="w-75 mx-auto shadow p-5">
                <h2 className="text-center mb-4">Add Subject Combination</h2>
                <form onSubmit = {handleSubjectSubmit}>
                    <div className="form-group mt-3">
                        <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter Core Course Paper1"
                        name="coreCoursePaper1"
                        value={coreCoursePaper1}
                        onChange={(e) => setCC1(e.target.value)}/>
                    </div>
                    <div className="form-group mt-3">
                        <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter Core Course Paper2"
                        name="coreCoursePaper2"
                        value={coreCoursePaper2}
                        onChange={(e) => setCC2(e.target.value)}/>
                    </div>
                    <div className="form-group mt-3">
                        <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter aecc"
                        name="aecc"
                        value={aecc}
                        onChange={(e) => setaecc(e.target.value)}/>
                    </div>
                    <div className="form-group mt-3">
                        <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter sec"
                        name="sec"
                        value={sec}
                        onChange={(e) => setsec(e.target.value)}/>
                    </div>
                    <div className="form-group mt-3">
                        <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter vac1"
                        name="coreCoursePaper1"
                        value={vac1}
                        onChange={(e) => setvac1(e.target.value)}/>
                    </div>
                    <div className="form-group mt-3">
                        <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter vac2"
                        name="coreCoursePaper1"
                        value={vac2}
                        onChange={(e) => setvac2(e.target.value)}/>
                    </div>
                    <button className="btn btn-primary btn-block mt-3">
                        Add Subject Combination
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewSubjectCombo;