import FormInput from "@/components/common/FormInput";
import { EditUsernameProps } from "../ProfileInterfaces";

const EditUsernamePopup : React.FC<EditUsernameProps> = ({formData, onChange }) => {
    return (    
        <>
            <fieldset className="items-center mb-2">
                <FormInput 
                    id="username"
                    label="Username"
                    type="text"
                    placeholder="(Optional)"
                    value={formData.username}
                    onChange={onChange}
                />
            </fieldset>
            <fieldset className="items-center mb-2">
                <FormInput 
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Current Password"
                    value={formData.password}
                    onChange={onChange}
                />
            </fieldset>
        </>
                    
    );
}

export default EditUsernamePopup;