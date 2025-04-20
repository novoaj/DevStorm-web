import FormInput from "@/components/common/FormInput";
import { PopupComponentProps } from "../ProfileInterfaces";
import { useEffect } from "react";

const EditPasswordPopup : React.FC<PopupComponentProps> = ({formData, onChange, handleSetValid}) => {
    useEffect(() => {
        const { password, newPassword, newPassword2 } = formData;
        const isValid = 
            password && password.length > 0 &&
            newPassword && newPassword.length >= 6 &&
            newPassword === newPassword2;
        handleSetValid(isValid);
    }, [formData, handleSetValid])
    
    return (
        <>
            <fieldset className="items-center mb-2">
                <FormInput 
                    id="password"
                    label="Current Password"
                    type="text"
                    placeholder="Enter current password"
                    value={formData.password}
                    onChange={onChange}
                />
            </fieldset>
            <fieldset className="items-center mb-2">
                <FormInput 
                    id="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={onChange}
                />
            </fieldset>
            <fieldset className="items-center mb-2">
                <FormInput 
                    id="newPassword2"
                    label="New Password"
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword2}
                    onChange={onChange}
                />
            </fieldset>
            {formData.newPassword && formData.newPassword.length < 6 && (
                <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
            )}
            {formData.newPassword && formData.newPassword2 && formData.newPassword !== formData.newPassword2 && (
                <p className="text-red-500 text-sm">Passwords must match</p>
            )}
        </>
    )
}

export default EditPasswordPopup;