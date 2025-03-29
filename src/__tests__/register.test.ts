import { validateInputs, handleRegisterSubmit } from '../app/auth/register/page';
import axios from 'axios';
import { notifications } from '../utils/notifications';

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://test-api:5000';

// Mock dependencies
jest.mock('axios');
jest.mock('../utils/notifications', () => ({
  notifications: {
    success: {
      register: jest.fn()
    },
    warning: {
      registerValidation: jest.fn(),
      registerFailed: jest.fn()
    }
  }
}));

// tests for register - validateInputs
describe('validateInputs() helper function', () => {
  it('should return valid for valid inputs', () => {
    expect(validateInputs(
      'validuser',
      'Password123!',
      'Password123!'
    )).toEqual({
      valid: true,
      message: 'No issues'
    });
  });

  it('should return invalid for empty inputs', () => {
    expect(validateInputs(
      '',
      'Password123!',
      'Password123!'
    )).toEqual({
      valid: false,
      message: 'All fields must be filled in to register this account!'
    });
  });

  it('should return invalid when passwords do not match', () => {
    expect(validateInputs(
      'validuser',
      'Password123!',
      'DifferentPassword123!'
    )).toEqual({
      valid: false,
      message: 'Passwords must match!'
    });
  });

  it('should return invalid for username less than 5 characters', () => {
    expect(validateInputs(
      'user',
      'Password123!',
      'Password123!'
    )).toEqual({
      valid: false,
      message: 'Username must be at least 5 characters!'
    });
  });

  it('should return invalid for password less than 6 characters', () => {
    expect(validateInputs(
      'validuser',
      'Pass1',
      'Pass1'
    )).toEqual({
      valid: false,
      message: 'Password must be at least 6 characters!'
    });
  });
});

// register - handleSubmit tests
describe('handleSubmit', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return success when registration is valid and API call succeeds', async () => {
    // Mock successful API response
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    const result = await handleRegisterSubmit(
      'validuser',
      'password123',
      'password123',
      'test@example.com',
      mockRouter
    );

    // Check the result
    expect(result).toEqual({ success: true });

    // Verify API was called with correct data
    expect(axios.post).toHaveBeenCalledWith(
      'http://test-api:5000/register',
      {
        email: 'test@example.com',
        username: 'validuser',
        password: 'password123',
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

  it('should return failure when validation fails', async () => {
    const result = await handleRegisterSubmit(
      'user', // too short username
      'password123',
      'password123',
      'test@example.com',
      mockRouter
    );

    expect(result).toEqual({ success: false });
    expect(axios.post).not.toHaveBeenCalled();
    expect(notifications.warning.registerValidation).toHaveBeenCalledWith(
      'Username must be at least 5 characters!'
    );
  });

  it('should return failure when API call fails', async () => {
    // Mock API error
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const result = await handleRegisterSubmit(
      'validuser',
      'password123',
      'password123',
      'test@example.com',
      mockRouter
    );

    expect(result).toEqual({ success: false });
    expect(notifications.warning.registerFailed).toHaveBeenCalled();
  });

  it('should return failure when passwords do not match', async () => {
    const result = await handleRegisterSubmit(
      'validuser',
      'password123',
      'differentpassword',
      'test@example.com',
      mockRouter
    );

    expect(result).toEqual({ success: false });
    expect(axios.post).not.toHaveBeenCalled();
    expect(notifications.warning.registerValidation).toHaveBeenCalledWith(
      'Passwords must match!'
    );
  });
});