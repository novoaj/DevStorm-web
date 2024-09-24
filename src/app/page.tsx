"use client"
import React, { useState, useContext } from "react";
import RoleSelection from "./components/RoleSelection";
import ToolsSelection from "./components/ToolsSelection";
import IndustrySelection from "./components/IndustrySelection";
import Results from "./components/Results";
import { toast } from 'sonner';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "./context/UserContext";
// https://fkhadra.github.io/react-toastify/introduction/

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

export default function Home() {
  // get started button that leads user to linear progression of 
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
  // helper method to determine if a jwt token is expired/invalid
  const tokenIsExpired = (token: string | null) => {
    if (token === null){
      return true;
    }
    let decoded = jwtDecode(token)
    if (decoded?.exp && decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("access");
      return true;
    }
    return false;
  }
  // if user is logged in, allow them to start the brainstorming steps through "Get started" button
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
  // handles the submitting of user choices to our api endpoint. moves on to results page if successful
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  const handleSubmit = () => {
    
    // Logic for submitting user selections
    let url = "http://127.0.0.1:5000/api/prompt";
    // let token = localStorage.getItem("access");
    // axios.defaults.withCredentials = true;
    axios.post(url, {
      role: userSelections.roles.map(role => role.value),
      technology: userSelections.tech.map(tech => tech.value),
      industries: userSelections.industries.map(industry => industry.value),
    }, {
      headers: {
        withCredentials: true  // This ensures cookies are sent and stored
      }
    })
    .then((response) => {
      if (response.status === 200){
        let obj = JSON.parse(response.data.response)
        setResults(obj);
        toast.info('Selections submitted successfully!', {
          duration: 5000,
        });
        handleNext();
      }else{
        toast.error('Error generating results!', {
          duration: 5000,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error('Error generating results!', {
        duration: 5000,
      });
    })    
  };
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
    <div className="flex justify-center min-h-screen">
      <div className="content-center mx-auto px-4 text-slate-100 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-8/12">
        <h1 className="text-4xl font-bold mt-10">Welcome to our Brainstorming App!</h1>
        <p className="mt-4">Your guide to exploring tech careers as a student.</p>
        {isStarted ?
        <>
          <div className="mt-10 h-fit bg-primary-100 border border-slate-500 text-slate-100 shadow-md rounded ">
            {(localStorage.getItem("access") !== null) && steps[currentStep] && (
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
                    onClick={handleSubmit}
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
      </div>
    </div>
  );
}
