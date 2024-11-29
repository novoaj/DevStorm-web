import React, {useState} from "react";
import Select from "react-select";

interface RoleSelectionProps {
    userChoices: { value: string; label: string }[]; // Correctly typed userChoices
    onChoiceChange: (choices: { value: string; label: string }[]) => void; // Correctly typed onChoiceChange
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ userChoices, onChoiceChange }) => {
    const [userChoice, setUserChoice] = useState([])
    const options : any = [
        { value: "Frontend Engineer", label: "Frontend Engineer"},
        { value: "Mobile Developer", label: "Mobile Developer"},
        { value: "Web Developer", label: "Web Developer"},
        { value: "Backend Engineer", label: "Backend Engineer"},
        { value: "Game Developer", label: "Game Developer"},
        { value: "Data Scientist", label: "Data Scientist"},
        { value: "Data Analyst", label: "Data Analyst"},
        { value: "AI/ML Engineer", label: "AI/ML Engineer"},
        { value: "Cybersecurity", label: "Cybersecurity"},
        { value: "DevOps Engineer", label: "DevOps Engineer"},
        { value: "Cloud Engineer", label: "Cloud Engineer"},
        { value: "Network Engineer", label: "Network Engineer"},
        { value: "Cybersecurity Engineer", label: "Cybersecurity Engineer"},
    ]

    const handleChange = (choices: any) => {
        setUserChoice(choices); // Update local state
        onChoiceChange(choices); // Update parent state via callback
      };

    const customStyles = {
        option: (styles: any, { isSelected }: any) => ({
            ...styles,
            backgroundColor: isSelected ? '#171d22' : 'text-slate-200',
            color: isSelected ? 'white' : '#171d22',
            '&:hover': {
                backgroundColor: '#171d22',
                color: 'white'
            }
        }),
        multiValue: (styles: any) => ({
            ...styles,
            backgroundColor: '#171d22',
        }),
        multiValueLabel: (styles: any) => ({
            ...styles,
            color: 'white',
        })
    };

    return(
        <div className="pt-5">
            <p>Maximum of 3 selections</p>
            <br/>
            <Select 
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                closeMenuOnSelect={false} 
                defaultValue={"Role"} 
                options={options} 
                isMulti
                styles={customStyles}
                isOptionDisabled={() => userChoice.length >= 3}
                onChange={handleChange}
            />
        </div>
    )
}
export default RoleSelection;