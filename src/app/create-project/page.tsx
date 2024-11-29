"use client";
import { useState, useContext, useEffect } from "react";
import RoleSelection from "./RoleSelection";
import ToolsSelection from "./ToolsSelection"
import IndustrySelection from "./IndustrySelection";
import Results from "./Results";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../axiosInstance";
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
    // generate project from api
    const handleSubmit = async(userSelections : UserSelections) => {
        if (selections["industries"].length !== 1){
            toast.info('Please make selection before continuing', {
                duration: 2000,
            });
            return;
        }
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/prompt";
        try{
            const response = await axiosInstance.post(url, {
                role: userSelections.roles.map(role => role.value),
                technology: userSelections.tech.map(tech => tech.value),
                industries: userSelections.industries.map(industry => industry.value),
            }, {
                withCredentials: true,  // This ensures cookies are sent and stored
            })
            // handle response
            if (response){
                let obj = JSON.parse(response.data.response);
                toast.info('Selections submitted successfully!', {
                duration: 2000,
                });
                setResults(obj);
                setStep((prev) => prev + 1);
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
            console.log(response);
            if (response){
                toast.success('Project saved successfully!', {
                    duration: 4000,
                });
                router.push("/profile");
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
                {isLoggedIn ?  (
                    <>
                        <h2 className="text-2xl font-semibold mb-5">{steps[step].title}</h2>
                        <CurrentStepComponent
                            userChoices={selections[Object.keys(selections)[step] as keyof UserSelections]}
                            onChoiceChange={(choices) => setUserChoices(Object.keys(selections)[step] as keyof UserSelections, choices)}
                            results={results}
                        />
                        <div className="flex justify-between mt-5">
                                <button onClick={handleReset} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded-full">
                                    Reset
                                </button>
                                <div>
                                    {step > 0 && step < steps.length - 1 && (
                                        <button onClick={handleBack} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded-full mr-2">
                                            Prev
                                        </button>
                                    )}
                                    {step < steps.length - 2 && (
                                        <button onClick={handleNext} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded-full">
                                            Next
                                        </button>
                                    )}
                                    {step === steps.length - 2 && (
                                        <button onClick={() => handleSubmit(selections)} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded-full">
                                            Generate Project
                                        </button>
                                    )}
                                    {step === steps.length - 1 && (
                                        <button onClick={handleSaveProject} className="bg-secondary-100 hover:bg-secondary-200 hover:outline text-slate-100 px-3 py-1 rounded-full">
                                            Save Project
                                        </button>
                                    )}
                                </div>
                            </div>
                    </>
                ) : 
                    <p>Login or signup in order to create a project!</p>}
                </div>
            </div>
        </div>
        
    )
}
export default CreateProject