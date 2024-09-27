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
    return (
        <div className="pt-5">
            <Select 
                closeMenuOnSelect={true} 
                defaultValue={"Role"} 
                styles={{
                    option: (base) => ({
                    ...base,
                    border: `1px dotted black`,
                    height: '100%',
                    color: 'black'
                    }),
                }}
                options={options} 
                // isMulti
                onChange={handleChange}
            />
        </div>
    )
}
export default IndustrySelection;