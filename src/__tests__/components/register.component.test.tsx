import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { notifications } from '../../utils/notifications';
import { useRouter } from 'next/navigation';
import RegisterPage from '../../app/auth/register/page';

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
      register: jest.fn()
    },
    warning: {
      registerFailed: jest.fn(),
      registerValidation: jest.fn()
    }
  }
}));

describe('Register Component', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should handle successful registration', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

    const { getByLabelText, getByRole } = render(<RegisterPage />);
    
    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: 'validuser' }
    });
    fireEvent.change(getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(getByLabelText(/re-enter password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.submit(getByRole('button', { name: /continue/i }));

    // Wait for async operations and verify results
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://test-api:5000/register',
        {
          email: 'test@example.com',
          username: 'validuser',
          password: 'password123'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(notifications.success.register).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/confirm');
    });
  });

  it('should handle validation errors', async () => {
    const { getByLabelText, getByRole } = render(<RegisterPage />);
    
    // Fill in the form with invalid data
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: 'user' } // too short
    });
    fireEvent.change(getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(getByLabelText(/re-enter password/i), {
      target: { value: 'password123' } // matching passwords
    });

    // Submit the form
    fireEvent.submit(getByRole('button', { name: /continue/i }));

    // Verify validation messages
    expect(notifications.warning.registerValidation).toHaveBeenCalledWith(
      'Username must be at least 5 characters!'
    );
    expect(axios.post).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should handle registration failure', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Registration failed'));

    const { getByLabelText, getByRole } = render(<RegisterPage />);
    
    // Fill in the form with valid data
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: 'validuser' }
    });
    fireEvent.change(getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(getByLabelText(/re-enter password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.submit(getByRole('button', { name: /continue/i }));

    // Wait for async operations and verify results
    await waitFor(() => {
      expect(notifications.warning.registerFailed).toHaveBeenCalled();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
}); 