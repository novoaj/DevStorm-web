import { toast } from 'sonner';
import { notifications, DURATION } from '../utils/notifications';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  }
}));

describe('Notifications Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('success notifications', () => {
    it('should show login success notification', () => {
      notifications.success.login();
      expect(toast.success).toHaveBeenCalledWith('Successful Login!', { duration: DURATION.SHORT });
    });

    it('should show register success notification', () => {
      notifications.success.register();
      expect(toast.success).toHaveBeenCalledWith('Registration Successful!', { duration: DURATION.SHORT });
    });
  });

  describe('warning notifications', () => {
    it('should show login failed notification', () => {
      notifications.warning.loginFailed();
      expect(toast.warning).toHaveBeenCalledWith(
        'Login failed. Make sure your username and password is correct.',
        { duration: DURATION.MEDIUM }
      );
    });

    it('should show register failed notification', () => {
      notifications.warning.registerFailed();
      expect(toast.warning).toHaveBeenCalledWith(
        'Register failed (This username might already exist). Try again!',
        { duration: DURATION.SHORT }
      );
    });

    it('should show register validation notification with custom message', () => {
      const message = 'Test validation message';
      notifications.warning.registerValidation(message);
      expect(toast.warning).toHaveBeenCalledWith(message, { duration: DURATION.SHORT });
    });
  });

  describe('info notifications', () => {
    it('should show login required notification', () => {
      notifications.info.loginRequired();
      expect(toast.info).toHaveBeenCalledWith(
        'You must enter a valid username and password to continue',
        { duration: DURATION.SHORT }
      );
    });
  });
}); 