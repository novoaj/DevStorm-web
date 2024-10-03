"use client";
import { useState, useContext, useEffect } from "react";
import RoleSelection from "./RoleSelection";
import ToolsSelection from "./ToolsSelection"
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
const CreateProject : React.FC<any>  = () => {
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<UserSelections>({
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
        setSelections((prevSelections) => ({
        ...prevSelections,
        [category]: choices,
        }))
    }
    // steps to create project
    const steps = [
        { title: "Select Your Desired Role(s)", component: RoleSelection },
        { title: "Choose Tools/Tech", component: ToolsSelection },
        { title: "Select Industry/Interest", component: IndustrySelection },
        { title: "Generate Results", component: Results },
    ];
    // next and prev logic
    const handleNext = () => {
        if (selections[Object.keys(selections)[step] as keyof UserSelections].length === 0) {
            toast.info('Please make selection(s) before continuing', {
                duration: 2000,
            });
          return;
        }
        if (step < steps.length - 1) setStep(step + 1);
        else handleSubmit(selections);
      };
    
    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };
    // refresh logic: 
    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            "Content-Type": "application/json",
        }
    });
    axiosInstance.interceptors.request.use(async request => {
        console.log(request);
        const csrfToken = await fetchCSRFToken(); // inject csrf token into each request with this instance
        if (csrfToken) {
            request.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        return request;
      }, error => {
        return Promise.reject(error);
      });
    axiosInstance.interceptors.response.use(
        response => response, // successful response
        async error => {
            // error response from server is intercepted
            const originalRequest = error.config; 
            // console.log(error); // response from server
            console.log(error.response.status, originalRequest._retry) // !undefined -> (true)
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // mark retry as true so we don't retry more than once
                try {
                    // console.log("refreshing refresh token");
                    const csrfToken = await fetchCSRFToken(); 
                    const response = await axios.post("http://127.0.0.1:5000/token/refresh", {
                        "X-CSRF-TOKEN": csrfToken
                    }, {
                        withCredentials: true,
                    })
                    return axiosInstance(originalRequest); 
                }catch (refreshError) {
                    // refresh token is expired, force logout
                    localStorage.removeItem("isLoggedIn")
                    setIsLoggedIn(false);
                    setStep(0);
                    router.replace("/login");
                }
            }
        }
    )
    // generate project from api
    const handleSubmit = async(userSelections : UserSelections) => {
        if (selections["industries"].length !== 1){
            toast.info('Please make selection before continuing', {
                duration: 2000,
            });
            return;
        }
        let url = "http://127.0.0.1:5000/api/prompt";
        try{
            const response = await axiosInstance.post(url, {
                role: userSelections.roles.map(role => role.value),
                technology: userSelections.tech.map(tech => tech.value),
                industries: userSelections.industries.map(industry => industry.value),
            }, {
                withCredentials: true,  // This ensures cookies are sent and stored
            })
            // handle response
            if (response.status === 200) {
                let obj = JSON.parse(response.data.response);
                toast.info('Selections submitted successfully!', {
                duration: 2000,
                });
                setResults(obj);
                setStep((prev) => prev + 1);
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
    const handleReset = () => {
        // resets state variables, brings user back to getStarted
        setStep(0);
        setSelections({
            roles: [],
            tech: [],
            industries: [],
        });
    }
    // save project
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
        // TODO hit endpoint to save project
        let results_str = results.project_title + "\n\n" + results.description + "\n\n" + results.steps.map((step, index) => `${index + 1}) ${step}`).join("\n");
        downloadTxtFile(results_str);
        toast.success('Results downloaded successfully!', {
            duration: 2000,
        });
    };

    const handleSaveProject = async () => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/project/create";
        console.log(url);
        try {
            const response = await axiosInstance.post(url, {
                title: results.project_title,
                summary: results.description,
                steps: results.steps,
                languages: selections.tech.map(technology => technology.value)
            },{
                withCredentials: true,  // This ensures cookies are sent and stored
            })
            if (response.status === 201) {
                toast.success('Project saved successfully! Check out your saved projects in your profile page', {
                    duration: 4000,
                });
            }
        }catch (err) {
            console.error(err);
            toast.warning('Error saving your project.', {
                duration: 2000,
            });
        }
    }

    const CurrentStepComponent = steps[step].component;
    return (
        <div className="flex justify-center min-h-screen">
            <div className="mx-auto px-4 text-slate-100 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-8/12">
                <div className="mt-12 h-fit bg-primary-300 text-slate-100 p-5">
                    <h1 className="text-5xl">
                        Create Project
                    </h1>
                </div>
                <div className="mt-12 h-fit bg-primary-300 border border-slate-500 text-slate-100 shadow-md rounded p-5">
                {isLoggedIn && (
                    <>
                        <h2 className="text-2xl font-semibold mb-5">{steps[step].title}</h2>
                        <CurrentStepComponent
                            userChoices={selections[Object.keys(selections)[step] as keyof UserSelections]}
                            onChoiceChange={(choices) => setUserChoices(Object.keys(selections)[step] as keyof UserSelections, choices)}
                            results={results}
                        />
                        <div className="flex justify-between mt-5">
                                <button onClick={handleReset} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded">
                                    Reset
                                </button>
                                <div>
                                    {step > 0 && step < steps.length - 1 && (
                                        <button onClick={handleBack} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded mr-2">
                                            Prev
                                        </button>
                                    )}
                                    {step < steps.length - 2 && (
                                        <button onClick={handleNext} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded">
                                            Next
                                        </button>
                                    )}
                                    {step === steps.length - 2 && (
                                        <button onClick={() => handleSubmit(selections)} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded">
                                            Generate Project
                                        </button>
                                    )}
                                    {step === steps.length - 1 && (
                                        <button onClick={handleSaveProject} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded">
                                            Save Project
                                        </button>
                                    )}
                                </div>
                            </div>
                    </>
                )}
                </div>
            </div>
        </div>
        
    )
}
export default CreateProject