import { validateInputs, handleSubmit } from '../app/register/page';
import axios from 'axios';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('axios');
jest.mock('sonner', () => ({
  toast: {
    warning: jest.fn()
  }
}));

// tests for register - validateInputs
describe('validateInputs', () => {
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
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return success when registration is valid and API call succeeds', async () => {
    // Mock successful API response
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    const result = await handleSubmit(
      'validuser',
      'password123',
      'password123',
      'test@example.com'
    );

    // Check the result
    expect(result).toEqual({ success: true });

    // Verify API was called with correct data
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:5000/register',
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
  });

  it('should return failure when validation fails', async () => {
    const result = await handleSubmit(
      'user', // too short username
      'password123',
      'password123',
      'test@example.com'
    );

    expect(result).toEqual({ success: false });
    expect(axios.post).not.toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith(
      'Username must be at least 5 characters!',
      { duration: 2000 }
    );
  });

  it('should return failure when API call fails', async () => {
    // Mock API error
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const result = await handleSubmit(
      'validuser',
      'password123',
      'password123',
      'test@example.com'
    );

    expect(result).toEqual({ success: false });
    expect(toast.warning).toHaveBeenCalledWith(
      'Register failed (This username might already exist). Try again!',
      { duration: 2000 }
    );
  });

  it('should return failure when passwords do not match', async () => {
    const result = await handleSubmit(
      'validuser',
      'password123',
      'differentpassword',
      'test@example.com'
    );

    expect(result).toEqual({ success: false });
    expect(axios.post).not.toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith(
      'Passwords must match!',
      { duration: 2000 }
    );
  });
});