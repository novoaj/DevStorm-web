import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProvider, UserContext } from '../app/context/UserContext';
import { useContext } from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component to access context
const TestComponent = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  return (
    <div>
      <div data-testid="login-status">{isLoggedIn.toString()}</div>
      <button onClick={() => setIsLoggedIn(true)}>Login</button>
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with isLoggedIn as false', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId('login-status')).toHaveTextContent('false');
  });

  it('should update isLoggedIn state when setIsLoggedIn is called', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Initially false
    expect(screen.getByTestId('login-status')).toHaveTextContent('false');

    // Click login button
    act(() => {
      screen.getByText('Login').click();
    });
    expect(screen.getByTestId('login-status')).toHaveTextContent('true');

    // Click logout button
    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('login-status')).toHaveTextContent('false');
  });

  it('should persist isLoggedIn state in localStorage', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Login
    act(() => {
      screen.getByText('Login').click();
    });
    expect(localStorage.getItem('isLoggedIn')).toBe('true');

    // Logout
    act(() => {
      screen.getByText('Logout').click();
    });
    expect(localStorage.getItem('isLoggedIn')).toBe('false');
  });

  it('should initialize with value from localStorage if available', () => {
    // Set initial value in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId('login-status')).toHaveTextContent('true');
  });

  it('should handle invalid localStorage value gracefully', () => {
    // Set invalid value in localStorage
    localStorage.setItem('isLoggedIn', 'invalid');

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId('login-status')).toHaveTextContent('false');
  });
}); 