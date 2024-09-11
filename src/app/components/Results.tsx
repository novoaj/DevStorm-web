import React from "react";

interface ResultProps{
    results: string;
}

const Results: React.FC<ResultProps> = ({results}) => {
    return (
        <>
         <h1>Results: </h1>
         <p>{results}</p>
        </>
    )
}
export default Results;