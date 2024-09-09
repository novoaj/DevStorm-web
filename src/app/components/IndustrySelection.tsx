import React, {useState} from "react";
import Select from "react-select";

interface IndustrySelectionProps {
    userChoices: { value: string; label: string }[]; // Correctly typed userChoices
    onChoiceChange: (choices: { value: string; label: string }[]) => void; // Correctly typed onChoiceChange
}

const IndustrySelection: React.FC<IndustrySelectionProps> = ({ userChoices, onChoiceChange }) => {
    const [userChoice, setUserChoice] = useState({})
    const options = [
        { value: "Tech", label: "Tech"},
        { value: "Finance", label: "Finance"},
        { value: "Fitness", label: "Fitness"},
        { value: "Environment", label: "Environment"},
    ]
    // TODO: add more options
    const handleChange = (choices: any) => {
        setUserChoice(choices); // Update local state
        onChoiceChange(choices); // Update parent state via callback
      };
    return (
        <div className="pt-5">
            <Select 
                closeMenuOnSelect={false} 
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
                isMulti
                onChange={handleChange}
            />
        </div>
    )
}
export default IndustrySelection;