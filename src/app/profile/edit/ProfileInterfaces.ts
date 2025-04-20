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
    initialData: any;
    handleSubmit: (formData : any) => Promise<void>;
  }

export interface PopupComponentProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSetValid: (isValid: boolean) => void;
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