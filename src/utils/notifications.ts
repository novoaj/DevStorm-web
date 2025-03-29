import { toast } from 'sonner';

// Standard durations in milliseconds
export const DURATION = {
    SHORT: 2000,
    MEDIUM: 5000,
    LONG: 8000
} as const;

export const notifications = {
    success: {
        login: () => toast.success('Successful Login!', { duration: DURATION.SHORT }),
        register: () => toast.success('Registration Successful!', { duration: DURATION.SHORT }),
        // Add more success messages as needed
    },
    warning: {
        loginFailed: () => toast.warning('Login failed. Make sure your username and password is correct.', { duration: DURATION.MEDIUM }),
        registerFailed: () => toast.warning('Register failed (This username might already exist). Try again!', { duration: DURATION.SHORT }),
        registerValidation: (message: string) => toast.warning(message, { duration: DURATION.SHORT }),
        // Add more warning messages as needed
    },
    info: {
        loginRequired: () => toast.info('You must enter a valid username and password to continue', { duration: DURATION.SHORT }),
        // Add more info messages as needed
    }
}; 