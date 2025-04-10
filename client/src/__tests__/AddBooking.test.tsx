import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import AddBooking from '../pages/AddBooking';
import ToastProvider from "../context/ToastContext";
import api from '../api';

jest.mock('../api');

const mockProducts = [
  { _id: '1', name: 'Product 1', pricePerKg: 100, quantity: 10, category: 'Category 1' },
  { _id: '2', name: 'Product 2', pricePerKg: 200, quantity: 0, category: 'Category 2' },
];

describe('AddBooking Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <ToastProvider>
        <AddBooking />
      </ToastProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });



  it('renders products correctly when API call succeeds', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

    render(
      <ToastProvider>
        <AddBooking />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('renders "No products" message when there are no products', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <ToastProvider>
        <AddBooking />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('There are no products')).toBeInTheDocument();
    });
  });

  it('disables "Buy" button for out-of-stock products', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

    render(
      <ToastProvider>
        <AddBooking />
      </ToastProvider>
    );

    await waitFor(() => {
      const buyButtons = screen.getAllByText('Buy');
      expect(buyButtons[1]).toBeDisabled();
    });
  });

  it('displays booking form and handles submission correctly', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

    render(
      <ToastProvider>
        <AddBooking />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Buy')[0]);

    expect(screen.getByText('Buy Product 1')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Quantity:'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Submit'));

    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    await waitFor(() => {
      expect(screen.queryByText('Buy Product 1')).not.toBeInTheDocument();
    });
  });

  it('shows error message when chosen quantity exceeds available quantity', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducts });

    render(
      <ToastProvider>
        <AddBooking />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Buy')[0]);

    expect(screen.getByText('Buy Product 1')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Quantity:'), { target: { value: '15' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Chosen quantity is not available. Only 10 is available.')).toBeInTheDocument();
    });
  });
});
