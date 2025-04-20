import { useEffect } from "react";
import FormInput from "@/components/common/FormInput";
import { PopupComponentProps } from "../ProfileInterfaces";

const EditUsernamePopup : React.FC<PopupComponentProps> = ({formData, onChange, handleSetValid }) => {
    useEffect(() => {
        const { username, password } = formData;
        const isValid = 
            username && username.length >= 5 &&
            password && password.length > 0;
        handleSetValid(isValid);
    }, [formData, handleSetValid]);
    
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
                    placeholder="Password"
                    value={formData.password}
                    onChange={onChange}
                />
            </fieldset>
            {formData.username && formData.username.length < 5 && (
                <p className="text-red-500 text-sm">Username must be at least 5 characters</p>
            )}
        </>
                    
    );
}

export default EditUsernamePopup;