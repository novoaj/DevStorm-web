import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { notifications } from '../../utils/notifications';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import LoginPage from '../../app/auth/login/page';

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://test-api:5000';

// Mock dependencies
jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));
jest.mock('../../utils/notifications', () => ({
  notifications: {
    success: {
      login: jest.fn()
    },
    warning: {
      loginFailed: jest.fn()
    },
    info: {
      loginRequired: jest.fn()
    }
  }
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn()
}));

describe('Login Submit Handler', () => {
  const mockRouter = {
    push: jest.fn()
  };
  const mockSetIsLoggedIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useContext as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: mockSetIsLoggedIn
    });
  });

  it('should handle successful login correctly', async () => {
    // Mock successful API response
    let username = 'testuser';
    let password = 'password123';
    (axios.post as jest.Mock).mockResolvedValueOnce({ 
      status: 200,
      data: {} 
    });

    const { getByLabelText, getByRole } = render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: username }
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password }
    });

    // Submit the form
    fireEvent.submit(getByRole('button', { name: /submit/i }));

    // Wait for async operations and verify results
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://test-api:5000/login',
        {
          username: username,
          password: password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(notifications.success.login).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });
  });

  it('should handle empty input fields', async () => {
    const { getByRole } = render(<LoginPage />);

    // Submit form with empty fields
    fireEvent.submit(getByRole('button', { name: /submit/i }));

    expect(notifications.info.loginRequired).toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should handle failed login attempt', async () => {
    let username = 'testuser';
    let password = 'wrongpassword';
    // Mock failed API response
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));
    const { getByLabelText, getByRole } = render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: username }
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password }
    });

    // Submit the form
    fireEvent.submit(getByRole('button', { name: /submit/i }));

    // Wait for async operations and verify results
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://test-api:5000/login',
        {
          username: username,
          password: password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(notifications.warning.loginFailed).toHaveBeenCalled();
      // expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      // expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
}); 