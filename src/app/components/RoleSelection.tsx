import React, {useState} from "react";
import Select from "react-select";

interface RoleSelectionProps {
    userChoices: { value: string; label: string }[]; // Correctly typed userChoices
    onChoiceChange: (choices: { value: string; label: string }[]) => void; // Correctly typed onChoiceChange
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ userChoices, onChoiceChange }) => {
    const [userChoice, setUserChoice] = useState({})
    const options = [
        { value: "Frontend Engineer", label: "Frontend Engineer"},
        { value: "Mobile Developer", label: "Mobile Developer"},
        { value: "Web Developer", label: "Web Developer"},
        { value: "Backend Engineer", label: "Backend Engineer"},
    ]
    // TODO: add more options
    const handleChange = (choices: any) => {
        setUserChoice(choices); // Update local state
        onChoiceChange(choices); // Update parent state via callback
      };
    console.log(userChoice)
    return(
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
export default RoleSelection;