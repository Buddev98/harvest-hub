import { render, screen, waitFor } from '@testing-library/react';
import MyAppointments from '../pages/MyAppointments';
import api from '../api';
import ToastProvider from "../context/ToastContext";

jest.mock('../api');

describe('MyAppointments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <ToastProvider>
        <MyAppointments />
      </ToastProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders message when no appointments are booked', async () => {
   
    (api.get as jest.Mock).mockRejectedValue({
      response: {
        status: 404,
        data: { error: 'Appointment not found' },
      },
    });


    render(
      <ToastProvider>
        <MyAppointments />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('There are no appointments')).toBeInTheDocument();
    });
  });

  it('renders booked appointments correctly', async () => {
    const mockAppointment = {
      _id: '1',
      doctorId: 'doc1',
      patientId: 'pat1',
      date: '2025-04-07',
      timeSlot: '10:00 AM - 11:00 AM',
      status: 'confirmed',
      createdAt: '2025-04-01T10:00:00Z',
    };

    (api.get as jest.Mock).mockResolvedValue({ data: [mockAppointment] });

    render(
      <ToastProvider>
        <MyAppointments />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2025-04-07')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument();
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });
  });

  
});
