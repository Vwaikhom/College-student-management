import React from "react";
//import { paginate } from "../../../../server/pagination";

const Pagination = ({ perPage, numberofPages, paginate}) => {
    const pageNumbers = [];
    for(let i = 1; i <= numberofPages; i++){
       pageNumbers.push(i);
    }
    return(
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick = {() => paginate(number)} className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination;