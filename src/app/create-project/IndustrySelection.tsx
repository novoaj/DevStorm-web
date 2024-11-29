import React, {useState} from "react";
import Select from "react-select";

interface IndustrySelectionProps {
    userChoices: { value: string; label: string }[]; // Correctly typed userChoices
    onChoiceChange: (choices: { value: string; label: string }[]) => void; // Correctly typed onChoiceChange
}

const IndustrySelection: React.FC<IndustrySelectionProps> = ({ userChoices, onChoiceChange }) => {
    const [userChoice, setUserChoice] = useState({})
    const options : any = [
        { value: "Technology", label: "Technology"},
        { value: "Finance", label: "Finance"},
        { value: "Fitness", label: "Fitness"},
        { value: "Environment", label: "Environment"},
        { value: "Entertainment", label: "Entertainment"},
        { value: "Social Media", label: "Social Media"},
        { value: "Food", label: "Food"},
        { value: "Gaming", label: "Gaming"},

    ]
    // TODO: add more options
    const handleChange = (choices: any) => {
        setUserChoice(choices); // Update local state
        onChoiceChange([choices]); // Update parent state via callback
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
                closeMenuOnSelect={true} 
                defaultValue={"Role"} 
                options={options} 
                // isMulti
                styles={customStyles}
                onChange={handleChange}
            />
        </div>
    )
}
export default IndustrySelection;