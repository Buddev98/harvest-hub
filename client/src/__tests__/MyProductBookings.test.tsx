import { render, screen, waitFor } from '@testing-library/react';
import MyBookings from '../pages/MyBookings';
import api from '../api';
import ToastProvider from "../context/ToastContext";

jest.mock('../api');

const mockBookings = [
  {
    _id: '1',
    productId: '123',
    quantityBooked: 2,
    bookingDate: '2025-04-09',
    status: 'booked',
  },
  {
    _id: '2',
    productId: '456',
    quantityBooked: 1,
    bookingDate: '2025-04-08',
    status: 'pending',
  },
];

describe('MyBookings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <ToastProvider>
        <MyBookings />
      </ToastProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders message when no bookings are found', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <ToastProvider>
        <MyBookings />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('There are no booking products')).toBeInTheDocument();
    });
  });

  it('renders bookings correctly', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockBookings });
    render(
      <ToastProvider>
        <MyBookings />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('2025-04-09')).toBeInTheDocument();
      expect(screen.getByText('booked')).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2025-04-08')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });


});
