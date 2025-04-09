import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../redux/store';
import LoginForm from '../pages/Login';
import { login } from '../redux/authSlice';
import api from '../api';
import { LoadingProvider } from '../context/LoadingContext';
import ToastProvider from '../context/ToastContext';

jest.mock('../api');
jest.mock('../redux/authSlice', () => ({
  login: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('LoginForm', () => {

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'setItem');
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  

  it('renders the login form', () => {
    render(
      <Provider store={store}>
        <LoadingProvider>
          <ToastProvider>
            <Router>
              <LoginForm />
            </Router>
          </ToastProvider>
        </LoadingProvider>
      </Provider>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId('submitBtn')).toBeInTheDocument();
  });

  it('validates form fields', async () => {
    render(
      <Provider store={store}>
        <LoadingProvider>
          <ToastProvider>
            <Router>
              <LoginForm />
            </Router>
          </ToastProvider>
        </LoadingProvider>
      </Provider>
    );

    const username = screen.getByTestId('username');
    const password = screen.getByTestId('password');
    fireEvent.change(username, { target: { value: 'sd' }});
    fireEvent.change(username, { target: { value: '' }});
    fireEvent.change(password, { target: { value: 'test'}});
    fireEvent.change(password, { target: { value: '' }});
    

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: { role: 'patient', token: 'fake-token' },
    });

    render(
      <Provider store={store}>
        <LoadingProvider>
          <ToastProvider>
            <Router>
              <LoginForm />
            </Router>
          </ToastProvider>
        </LoadingProvider>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByTestId('submitBtn'));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/login', {
        username: 'testuser',
        password: 'password123',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ role: 'patient', token: 'fake-token' }));
      expect(login).toHaveBeenCalledWith({ role: 'patient', token: 'fake-token' });
    });
  });
});
