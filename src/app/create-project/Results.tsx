import React from "react";

interface Results {
    project_title: string,
    description: string,
    steps: Array<string>
  }

interface ResultProps{
    results: Results;
}

const Results: React.FC<ResultProps> = ({results}) => {
    return (
        <>
            <h2 className="text-2xl pt-3 pb-3">{results.project_title}</h2>
            <p>{results.description}</p>
            <br/>
            <ul>
                {results.steps.map((step, index) => (
                    <li key={index}>{index+1}. {step}</li>
                ))}
            </ul>
        </>
    )
}
export default Results;