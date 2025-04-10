import React, { useEffect, useState } from 'react';
import api from "../api";
import Table from '../components/Table';
interface Booking {
  _id: string;
  productId?: string
    
  quantityBooked?: number;
  bookingDate?: string;
  status: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const columns = [
    { header: "product ID", render: (booking: Booking) => booking.productId },
    
    { header: "Quantity Booked", render: (booking: Booking) => booking.quantityBooked },
    { header: "Booking date", render: (booking: Booking) => booking.bookingDate },
    { header: "status", render: (booking: Booking) => booking.status}
    
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/mybookings');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.log('Error getting booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

 

  return (
    <div>
      <h2>My Bookings</h2>
      <div>
      {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>There are no booking products</p>
        ) : (

       <Table<Booking>
      data={bookings}
      columns={columns}
      
    />
      )}
    </div>
    </div>
  );
};

export default MyBookings;
