import { notifications } from '../../../utils/notifications';
import axios from 'axios';

export const validateLoginInputs = (username: string, password: string) => {
    if (username === "" || password === "") {
        notifications.info.loginRequired();
        return false;
    }
    return true;
};

export const handleLoginSubmit = async (
    username: string,
    password: string,
    setIsLoggedIn: (value: boolean) => void,
    router: { push: (path: string) => void }
) => {
    if (!validateLoginInputs(username, password)) {
        return { success: false };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;
    try {
        const response = await axios.post(url, {
            username: username,
            password: password
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        setIsLoggedIn(true);
        notifications.success.login();
        return { success: true };
    } catch (error) {
        console.log(error);
        notifications.warning.loginFailed();
        return { success: false };
    }
};