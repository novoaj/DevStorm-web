import EditProfileCard from "./EditProfileCard";
import EditPasswordPopup from "./popups/EditPasswordPopup";
import EditUsernamePopup from "./popups/EditUsernamePopup";
import { ProfileItem, User } from "./ProfileInterfaces";

interface EditProfileListProps {
    user: User;
}
const EditProfileList: React.FC<EditProfileListProps> = ({user}) => {
    // Define an array of profile items with the above interface
    const profileItems: ProfileItem[] = [
        {
            title: "Edit Username",
            description: "Your username is how other people can find you on DevStorm",
            popup: EditUsernamePopup,
            user: user
        },
        {
            title: "Change Password",
            description: "Change your password",
            popup: EditPasswordPopup,
            user: user
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
                />
            ))}
        </>
    );
};

export default EditProfileList;