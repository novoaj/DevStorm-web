import axios from 'axios';
import { toast } from 'sonner';
import { handleLoginSubmit } from '../app/auth/login/page';

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://test-api:5000';

// Mock dependencies
jest.mock('axios');
jest.mock('sonner', () => ({
    toast: {
        info: jest.fn(),
        success: jest.fn(),
        warning: jest.fn()
    }
}));

describe('handleLoginSubmit', () => {
    const mockSetIsLoggedIn = jest.fn();
    const mockRouter = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful login', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });
        
        const result = await handleLoginSubmit('testuser', 'password123', mockSetIsLoggedIn, mockRouter);

        expect(result).toEqual({ success: true });
        expect(axios.post).toHaveBeenCalledWith(
            'http://test-api:5000/login',
            { username: 'testuser', password: 'password123' },
            expect.any(Object)
        );
        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
        expect(mockRouter.push).toHaveBeenCalledWith('/profile');
        expect(toast.success).toHaveBeenCalled();
    });

    it('should handle failed login', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));
        
        const result = await handleLoginSubmit('testuser', 'wrongpass', mockSetIsLoggedIn, mockRouter);

        expect(result).toEqual({ success: false });
        expect(toast.warning).toHaveBeenCalled();
        expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
    });
});

