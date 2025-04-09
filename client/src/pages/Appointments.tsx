import React, { useEffect, useState } from 'react';
import api from "../api";
import { useToast } from "../hooks/useToast";
import Table from "../components/Table";
import GenericModel from '../components/GenericModel';

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const columns = [

    { header: "Appointment ID", render: (appointment: Appointment) => appointment._id },
    { header: "Date", render: (appointment: Appointment) => appointment.date },

    { header: "Time Slot", render: (appointment: Appointment) => appointment.timeSlot },
    { header: "Status", render: (appointment: Appointment) => appointment.status },

  ];
  const renderRowActions = (appointment: Appointment) => (
    <>
      <button
        className="text-blue-500 cursor-pointer bg-yellow-500 rounded  hover:bg-yellow-600 p-2"
        onClick={() => openModal(appointment._id)}
      >
        Approve
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
      const response = await api.get('/getappointlist?status=waitlisted');
      setAppointments(response.data);
    } catch (error) {
      showToast('error', 'Oops something went wrong, please try after some time', { position: "top-right" })
      console.error('Error fetching appointments:', error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async () => {

    if (!selectedAppointmentId) return;
    try {
      const response = await api.patch(`/appointments/approve/${selectedAppointmentId}`);
      console.log('Appointment confirmed:', response.data);
      fetchAppointments()
      showToast('success', 'status has been updated sucessfully', { position: "top-right" })
    } catch (error) {
      showToast('error', 'Oops something went wrong, please try after some time', { position: "top-right" })
      console.error('Error confirming appointment:', error);
    }
    finally {
      closeModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-sm font-bold mb-4">Appointments for Approval</h1>
      <div className="mb-4">
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>There are no waitlisted appointments</p>
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
          <h4>Confirm Appointment</h4>
          <p>Are you sure you want to approve this appointment?</p>

        </GenericModel>
      </div>
    </div>
  );
};

export default Appointments;
