export interface User {
    username: string;
    email: string;
    dateJoined: string;
    projects: number;
    projectsCompleted: number;
}
export interface ProfileItem {
    title: string;
    description: string;
    popup: React.ComponentType<any>;
    user: User;
  }

export interface EditUsernameProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}
interface passwordForm {
    password: string;
    newPassword: string;
    newPassword2: string;
}
export interface EditPasswordProps {
    formData: passwordForm;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}