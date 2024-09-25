"use client";
import { useState, useContext } from "react";
import RoleSelection from "./RoleSelection";
import ToolsSelection from "./ToolsSelection";
import IndustrySelection from "./IndustrySelection";
import Results from "./Results";
import { UserContext } from "../context/UserContext";
import { fetchCSRFToken } from "../actions/actions";
import { toast } from "sonner";
import axios from "axios";

interface UserSelections {
    roles: Array<{ value: string; label: string }>;
    tech: Array<{ value: string; label: string }>;
    industries: Array<{ value: string; label: string }>;
}
interface ResultsType {
    project_title: string,
    description: string,
    steps: Array<string>
}

interface ClientHomeProps {
   
}

export const ClientHome: React.FC<ClientHomeProps> = ({}) => {
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const [isStarted, setIsStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [userSelections, setUserSelections] = useState<UserSelections>({
        roles: [],
        tech: [],
        industries: [],
    })
    const [results, setResults] = useState<ResultsType>({
        project_title: "",
        description: "",
        steps: [],
    });
    // if not logged in, get started isn't reachable and prompt them to log in
    const setUserChoices = (category : keyof UserSelections, choices : Array<{ value: string; label: string }>) => {
        setUserSelections((prevSelections) => ({
        ...prevSelections,
        [category]: choices,
        }))
    }
    // get started -> role -> tools/tech -> industries that interest them -> generate results that are downloadable
    const steps = [
        { title: "Select Your Desired Role(s)", content: 
        <RoleSelection 
            userChoices={userSelections.roles}
            onChoiceChange={(choices) => setUserChoices("roles", choices)}
            /> },
        { title: "Choose Tools/Tech", content: 
        <ToolsSelection 
            userChoices={userSelections.tech}
            onChoiceChange={(choices) => setUserChoices("tech", choices)}
        /> },
        { title: "Select Industries/Interests", content: 
        <IndustrySelection 
            userChoices={userSelections.industries}
            onChoiceChange={(choices) => setUserChoices("industries", choices)}
        /> },
        { title: "Generate Results", content: <Results results={results} /> },
    ];
    // if not logged in, user is given an error message prompting log in
    const handleGetStarted = () => {
        if (isLoggedIn) {
        setIsStarted(true);
        }else{
        toast.info('Need to login before accessing this feature', {
            duration: 5000,
        });
        }
    }
    const makeSelectionNoti = () => {
        toast.info('Please make selection(s) before continuing', {
        duration: 5000,
        });
    }
    const handleSubmit = async(userSelections : UserSelections) => {
        // call parent handleSubmit using userSelections
        const csrfToken = await fetchCSRFToken();
        console.log("child component handleSubmit");
        console.log(csrfToken);
        console.log(document.cookie)
        if (csrfToken === null || csrfToken === ""){
            console.log("error, no csrf token")
        }
        let url = "http://127.0.0.1:5000/api/prompt";
        try{
            // axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
            const response = await axios.post(url, {
                role: userSelections.roles.map(role => role.value),
                technology: userSelections.tech.map(tech => tech.value),
                industries: userSelections.industries.map(industry => industry.value),
            }, {
                withCredentials: true,  // This ensures cookies are sent and stored
                headers: {
                    'X-CSRF-TOKEN': csrfToken,  // Add CSRF token to headers
                }
            })
        // handle response
        if (response.status === 200) {
            let obj = JSON.parse(response.data.response);
            toast.info('Selections submitted successfully!', {
            duration: 5000,
            });
            setResults(obj);
            setCurrentStep((prev) => prev + 1);
        } else {
            toast.error('Error generating results!', {
            duration: 5000,
            });
        }
        } catch (err) {
        console.log(err);
        toast.error('Error generating results!', {
            duration: 5000,
        });
        }
        
    }
    // helper method for handleDownload to download user results locally to a txt file (formatted)
    // https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
    const downloadTxtFile = (text : string) => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "myFile.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    // used for handling download click from client. prompts local download of file to txt format
    const handleDownloadResults = () => {
        // Logic to download results
        let results_str = results.project_title + "\n\n" + results.description + "\n\n" + results.steps.map((step, index) => `${index + 1}) ${step}`).join("\n");
        downloadTxtFile(results_str);
        toast.success('Results downloaded successfully!', {
        duration: 5000,
        });
    };
    // reset logic when user is done generating this plan
  const backToHome = () => {
    // resets state variables, brings user back to getStarted
        setCurrentStep(0);
        setIsStarted(false);
    }
    // handles the stepthrough logic of the homepage
    const handleNext = () => {
        if (currentStep === 0 && userSelections.roles.length === 0){
        makeSelectionNoti();
        return;
        }
        if (currentStep === 1 && userSelections.tech.length === 0){
        makeSelectionNoti();
        return;
        }
        if (currentStep === 2 && userSelections.industries.length === 0){
        makeSelectionNoti();
        return;
        }
        setCurrentStep((prevStep) => prevStep + 1);
    }

    const handlePrev = () => {
        setCurrentStep((prevStep => prevStep - 1));
    }
    return (
        <>
            {isStarted ?
            <>
            <div className="mt-10 h-fit bg-primary-100 border border-slate-500 text-slate-100 shadow-md rounded ">
                {(isLoggedIn) && steps[currentStep] && (
                <div className=" w-full mb-10 h-fit p-5">
                    <h2 className="text-2xl font-semibold">{steps[currentStep].title}</h2>
                    {steps[currentStep].content}
                </div>
                )}
                <div className="flex content-baseline justify-end m-2 p-3">
                {currentStep < 2 ? 
                    (<>
                    <div className="ml-3 mr-3">
                        <button disabled={currentStep == 0} onClick={handlePrev} className="justify-self-start bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 pl-3 pr-3 pt-1 pb-1 rounded">
                        Back
                        </button>
                    </div>
                    <div className="justify-end">
                        <button onClick={handleNext} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 pl-3 pr-3 pt-1 pb-1 rounded">
                        Next
                        </button>
                    </div>
                </>)
                : currentStep === 2 ? (
                    <div className="justify-end">
                    <button
                        onClick={() => handleSubmit(userSelections)}
                        className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 pl-3 pr-3 pt-1 pb-1 rounded"
                    >
                        Submit
                    </button>
                    </div>
                ) : (
                    <>
                    <div className="ml-3 mr-3">
                        <button disabled={currentStep == 0} onClick={backToHome} className="justify-self-start bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 pl-3 pr-3 pt-1 pb-1 rounded">
                        Reset
                        </button>
                    </div>
                    <div className="justify-end">
                        <button
                        onClick={handleDownloadResults}
                        className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 pl-3 pr-3 pt-1 pb-1 rounded"
                        >
                        Download Results
                        </button>
                    </div>
                    </>
                    
                )}
                </div>
            </div>
            </> : 
            <>
            <button onClick={handleGetStarted} className="mt-10 h-10 rounded-lg bg-white hover:bg-secondary-100 hover:text-slate-100 hover:border font-bold px-5 text-black">Get Started</button>
            </>}
        </>
    );
}