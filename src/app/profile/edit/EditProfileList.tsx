import { toast } from "sonner";
import EditProfileCard from "./EditProfileCard";
import EditPasswordPopup from "./popups/EditPasswordPopup";
import EditUsernamePopup from "./popups/EditUsernamePopup";
import { ProfileItem, User } from "./ProfileInterfaces";
import { updateUsername, updatePassword } from "../../actions/profile-actions";

interface EditProfileListProps {
    user: User;
}

const EditProfileList: React.FC<EditProfileListProps> = ({user}) => {
    // update username on the backend
    const handleUpdateUsername = async(formData: any) => {
        if (user && user.username !== formData.username){
            if (formData.username.length < 5) {
                toast.error("New username must be 5+ characters")
                return;
            }
            
            try {
                const result = await updateUsername(formData.username, formData.password);
                
                if (result.success) {
                    toast.success("Changed Username");
                } else {
                    toast.error(result.message || "Failed to change username");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error resetting username. This username might be taken. Make sure password is filled in correctly");
            }
        } else {
            toast.error("Failed to change username.");
        }
    }

    // server action for password update
    const handleUpdatePassword = async(formData: any) => {
        const { password, newPassword, newPassword2 } = formData;
        
        if (newPassword != newPassword2) {
            toast.error("Error updating password. New passwords must match!");
            return;
        } else if (newPassword.length < 6) {
            toast.error("Error updating password. New password must be at least 6 characters!");
            return;
        }  
        
        try {
            const result = await updatePassword(password, newPassword);
            
            if (result.success) {
                toast.success("Changed Password");
            } else {
                toast.error(result.message || "Failed to change password");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error resetting password. Make sure password is filled in correctly");
        }
    }

    // Define an array of profile items
    const profileItems: ProfileItem[] = [
        {
            title: "Edit Username",
            description: "Your username is how other people can find you on DevStorm",
            popup: EditUsernamePopup,
            user: user,
            initialData: {
                username: user.username,
                password: ""
            },
            handleSubmit: handleUpdateUsername,
        },
        {
            title: "Change Password",
            description: "Change your password",
            popup: EditPasswordPopup,
            user: user,
            initialData: {
                password: "",
                newPassword: "",
                newPassword2: ""
            },
            handleSubmit: handleUpdatePassword,
        },
    ];

    return (
        <>
            {profileItems.map((item, index) => (
                <EditProfileCard 
                    key={index}
                    title={item.title}
                    description={item.description}
                    popup={item.popup}
                    user={user}
                    initialData={item.initialData}
                    handleSubmit={item.handleSubmit}
                />
            ))}
        </>
    );
};

export default EditProfileList;