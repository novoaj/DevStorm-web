import React from "react";

interface Results {
    project_title: string;
    description: string;
    steps: Array<string>;
}

interface ResultProps {
    results: Results;
}

const Results: React.FC<ResultProps> = ({ results }) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">{results.project_title}</h3>
                <div className="bg-primary-200 border border-slate-600 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-slate-200 mb-2">Description</h4>
                    <p className="text-slate-300 leading-relaxed">{results.description}</p>
                </div>
            </div>
            
            <div className="bg-primary-200 border border-slate-600 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-slate-200 mb-3">Implementation Steps</h4>
                <ol className="space-y-2">
                    {results.steps.map((step, index) => (
                        <li key={index} className="flex items-start text-slate-300">
                            <span className="bg-secondary-100 text-slate-100 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Results;