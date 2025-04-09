import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Appointments from '../pages/Appointments';
import api from '../api';
import ToastProvider from "../context/ToastContext";

jest.mock('../api');

describe('Appointments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <ToastProvider>
        <Appointments />
      </ToastProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders message when no appointments are booked', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <ToastProvider>
        <Appointments />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('There are no waitlisted appointments')).toBeInTheDocument();

    });
    
   
  });

  it('renders booked appointments correctly', async () => {
    const mockAppointment = {
      _id: '1',
      doctorId: 'doc1',
      patientId: 'pat1',
      date: '2025-04-05',
      timeSlot: '10:00 AM - 11:00 AM',
      status: 'confirmed',
      createdAt: '2025-04-01T10:00:00Z',
    };

    (api.get as jest.Mock).mockResolvedValue({ data: [mockAppointment] });

    render(
      <ToastProvider>
        <Appointments />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2025-04-05')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument();
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });
  });

  
});
