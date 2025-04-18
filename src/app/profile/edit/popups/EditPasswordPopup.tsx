import FormInput from "@/components/common/FormInput";
import { EditPasswordProps } from "../ProfileInterfaces";

const EditPasswordPopup : React.FC<EditPasswordProps> = ({formData, onChange}) => {
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
        </>
    )
}

export default EditPasswordPopup;