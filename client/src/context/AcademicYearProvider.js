import { createContext, useState } from "react";

const AcademicYearContext = createContext({});

export const AcademicYearProvider = ({ children }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const value = { year, setYear };
    return(
        <AcademicYearContext.Provider value={ value }>
            {children}
        </AcademicYearContext.Provider>
    )
}

export default AcademicYearContext;