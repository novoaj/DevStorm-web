"use client";
import { useState, useContext, useEffect } from "react";
import RoleSelection from "./RoleSelection";
import ToolsSelection from "./ToolsSelection";
import IndustrySelection from "./IndustrySelection";
import Results from "./Results";
import { UserContext } from "../context/UserContext";
import { fetchCSRFToken } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
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
// https://medium.com/@velja/token-refresh-with-axios-interceptors-for-a-seamless-authentication-experience-854b06064bde
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
    const router = useRouter();
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
        { title: "Select Industry/Interest", content: 
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
            duration: 2000,
        });
        }
    }
    const makeSelectionNoti = () => {
        toast.info('Please make selection(s) before continuing', {
            duration: 2000,
        });
    }

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            "Content-Type": "application/json",
        }
    });
    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response.state === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await axios.post("http://127.0.0.1:5000/token/refresh", {}, {
                        withCredentials: true,
                    })
                    return axiosInstance(originalRequest); 
                }catch (refreshError) {
                    console.log("token refresh failed, logging out...");
                    // refresh token is probably expired, redirect user to login again
                    localStorage.removeItem("isLoggedIn")
                    setIsLoggedIn(false);
                    setCurrentStep(0);
                    setIsStarted(false);
                    router.replace("/login");
                }
            }
        }
    )

    const handleSubmit = async(userSelections : UserSelections) => {
        const csrfToken = await fetchCSRFToken();
        if (csrfToken === null || csrfToken === ""){
            // can happen if user isLoggedIn=true but doesn't have a csrf token
            toast.error("Failed to validate user. Please Login/Signup and try again", {
                duration: 2000,
            });
            return;
        }
        let url = "http://127.0.0.1:5000/api/prompt";
        console.log(url)
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
            duration: 2000,
            });
            setResults(obj);
            setCurrentStep((prev) => prev + 1);
        } else {
            toast.error('Error generating results!', {
                duration: 2000,
            });
        }
        } catch (err) {
            console.error(err); // can happen if user doesn't have httponly cookies
            toast.error('Error generating results!', {
                duration: 2000,
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
            duration: 2000,
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

    useEffect(() => {
        if (!isLoggedIn) {
            // Perform any action needed when logged out, like redirecting
            setIsStarted(false);
            setCurrentStep(0);
            // router.replace("/login"); // Redirect to login page
        }
    }, [isLoggedIn, router]); // on router change or isLoggedIn context change, reset user
    return (
        <>
            {isStarted ?
            <>
            <div className="mt-10 h-fit bg-primary-300 border border-slate-500 text-slate-100 shadow-md rounded">
                {(isLoggedIn) && steps[currentStep] && (
                <div className=" w-full mb-10 h-fit p-5">
                    <h2 className="text-2xl font-semibold">{steps[currentStep].title}</h2>
                    {steps[currentStep].content}
                </div>
                )}
                <div className="flex content-baseline justify-end m-2 p-3">
                {currentStep < 2 ? 
                    (<>
                        {currentStep === 0 ? 
                            <></>: 
                            <div className="ml-3 mr-3">
                                <button disabled={currentStep == 0} onClick={handlePrev} className="justify-self-start bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 pl-3 pr-3 pt-1 pb-1 rounded">
                                    Back
                                </button>
                            </div>}

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