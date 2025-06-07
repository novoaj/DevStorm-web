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
        taskAdded: () => toast.success('Task added successfully!', { duration: DURATION.SHORT }),
        taskUpdated: () => toast.success('Task updated successfully!', { duration: DURATION.SHORT }),
        taskDeleted: () => toast.success('Task deleted successfully!', { duration: DURATION.SHORT }),
        // Add more success messages as needed
    },
    warning: {
        loginFailed: () => toast.warning('Login failed. Make sure your username and password is correct.', { duration: DURATION.SHORT }),
        registerFailed: () => toast.warning('Register failed (This username might already exist). Try again!', { duration: DURATION.SHORT }),
        registerValidation: (message: string) => toast.warning(message, { duration: DURATION.SHORT }),
        // Add more warning messages as needed
    },
    error: {
        taskMoveFailed: () => toast.error('Failed to move task. Changes have been reverted.', { duration: DURATION.MEDIUM }),
        taskAddFailed: () => toast.error('Failed to add task. Please try again.', { duration: DURATION.MEDIUM }),
        taskUpdateFailed: () => toast.error('Failed to update task. Changes have been reverted.', { duration: DURATION.MEDIUM }),
        taskDeleteFailed: () => toast.error('Failed to delete task. Please try again.', { duration: DURATION.MEDIUM }),
        // Add more error messages as needed
    },
    info: {
        loginRequired: () => toast.info('You must enter a valid username and password to continue', { duration: DURATION.SHORT }),
        // Add more info messages as needed
    }
}; 