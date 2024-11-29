import React, {useState} from "react";
import Select from "react-select";

interface ToolsSelectionProps {
    userChoices: { value: string; label: string }[]; // Correctly typed userChoices
    onChoiceChange: (choices: { value: string; label: string }[]) => void; // Correctly typed onChoiceChange
}
const ToolsSelection: React.FC<ToolsSelectionProps> = ({ userChoices, onChoiceChange })  => {
    const [userChoice, setUserChoice] = useState([])
    const options : any= [
        { value: "Java", label: "Java"},
        { value: "Python", label: "Python"},
        { value: "JavaScript", label: "JavaScript"},
        { value: "C", label: "C"},
        { value: "C++", label: "C++"},
        { value: "C#", label: "C#"},
        { value: "GoLang", label: "GoLang"},
        { value: "Rust", label: "Rust"},
        { value: "R", label: "R"},
        { value: "SQL", label: "SQL"},
        { value: "Swift", label: "Swift"},
        { value: "Kotlin", label: "Kotlin"},
    ]
    // TODO: add more options
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
export default ToolsSelection;