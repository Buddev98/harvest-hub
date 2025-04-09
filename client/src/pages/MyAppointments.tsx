import React, { useEffect, useState } from 'react';
import api from "../api";
import { useToast } from "../hooks/useToast";
import Table from '../components/Table';
import GenericModel from '../components/GenericModel';
import axios from 'axios';

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const columns = [

    { header: "Appointment ID", render: (appointment: Appointment) => appointment._id },
    { header: "Date", render: (appointment: Appointment) => appointment.date },

    { header: "Time Slot", render: (appointment: Appointment) => appointment.timeSlot },
    { header: "Status", render: (appointment: Appointment) => appointment.status },

  ];
  const renderRowActions = (appointment: Appointment) => (
    <>
      <button
        className={`text-blue-500  bg-yellow-500 rounded text-white hover:bg-yellow-600 p-2 ${appointment.status === 'canceled' ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => openModal(appointment._id)} disabled={appointment.status === 'canceled'}
      >
        Cancel
      </button>
    </>
  );
  const openModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };
  const fetchAppointments = async () => {
    console.log("coming inside useEffect");
    try {

      const response = await api.get(`/myappointment/`);
      console.log("my appointm", response.data)
      setAppointments(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)  && error.response?.status === 404) {
      setAppointments([]); // Set appointments to an empty array if not found
    } else {
      console.log('Error fetching appointments:', error);
      setAppointments([]); // Set appointments to an empty array in case of other errors
    }

    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async () => {

    try {
      const response = await api.patch(`/appointment/cancel/${selectedAppointmentId}`);
      console.log('Appointment cancelled:', response.data);

      fetchAppointments()

      showToast('success', 'Your appointment is canceled', { position: "top-right" })

    } catch (error) {
      showToast('error', 'Oops something went wrong, please try after some time', { position: "top-right" })
      console.log('Error confirming appointment:', error);
    }
    finally {
      closeModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      <div className="mb-4">

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>There are no appointments</p>
        ) : (

          <Table<Appointment>
            data={appointments}
            columns={columns}
            renderRowActions={renderRowActions}
          />
        )}
      </div>
      <div style={{ float: 'right' }}>
        <GenericModel
          isOpen={isModalOpen}
          onClose={closeModal}
          handleSubmit={handleSubmit}
        >
          <h4>Confirm Cancellation</h4>
          <p>Are you sure you want to cancel this appointment?</p>

        </GenericModel>
      </div>

    </div>
  );
};

export default MyAppointments;
