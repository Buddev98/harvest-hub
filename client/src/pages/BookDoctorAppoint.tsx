import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api";
 
const PatientDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const[booked,setBooked] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedslot,setBookedSlot] = useState<string|null>(null)
  const [showModal,setShowModal] = useState(false);
//   const user = useSelector(selectProperty);
//   console.log("santusan",user)
  const doctorId = "67efebc3137ae591045204ec"; // Replace with dynamic doctor selection
 
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);
 
  // Fetch available slots for the selected date
  const fetchAvailableSlots = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await api.get(
        `http://localhost:5000/available-slots/${doctorId}/${formattedDate}`
      );
      setAvailableSlots(response.data.availableSlots);
      setBooked(response.data.bookedSlots||[]);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };
 const bookHandle = async () => {
    if (!selectedDate) return alert("Please select a slot!");
    
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await api.post("http://localhost:5000/appointments", {
        doctorId,
        date: formattedDate,
        timeSlot: bookedslot,
      });
 
      alert(response.data.message);
      setBookedSlot(null);
      fetchAvailableSlots(selectedDate);
    //   setAvailableSlots((prev) => prev.filter((slot) => slot !== selectedSlot));
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
 } 
  // Handle booking an appointment
  const bookAppointment = async () => {
    if (!selectedSlot || !selectedDate) return alert("Please select a slot!");
    
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await api.post("http://localhost:5000/appointments", {
        doctorId,
        date: formattedDate,
        timeSlot: selectedSlot,
      });
 
      alert(response.data.message);
      setSelectedSlot(null);
      setAvailableSlots((prev) => prev.filter((slot) => slot !== selectedSlot));
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
 
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Select an Appointment Date</h2>
      
      {/* Calendar for Date Selection */}
      <div className="bg-white p-4 rounded shadow-md">
        <Calendar 
          onChange={(date) => setSelectedDate(date as Date)}
          value={selectedDate}
          minDate={new Date()} // Prevent past date selection
        />
      </div>
 
      {/* Available Slots */}
      {selectedDate && (
        <>
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-3">Available Slots</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots && availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <button
                  key={slot}
                  className={`px-4 py-2 border rounded ${
                    selectedSlot === slot ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p className="text-red-500">No slots available for this date.</p>
            )}
          </div>
        </div>
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-3">Booked Slots</h3>
          <div className="grid grid-cols-2 gap-2">
            {booked && booked.length > 0 ? (
              booked.map((slot) => (
                <button
                  key={slot}
                  className={`px-4 py-2 border rounded ${
                    bookedslot === slot ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => {setBookedSlot(slot);setShowModal(true)}}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p className="text-red-500">No slots available for this date.</p>
            )}
          </div>
        </div>
        </>
        
      )}
       
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm">
            <p className="mb-4 font-semibold">
              Slot <strong>{bookedslot}</strong> is already booked.
            </p>
            <p className="mb-4">Do you want to be waitlisted for this slot?</p>
            <div className="flex justify-around">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {bookHandle();setShowModal(false)}}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Book Button */}
      {selectedSlot && (
        <button
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded shadow-md"
          onClick={bookAppointment}
        >
          Confirm Appointment
        </button>
      )}
    </div>
  );
};
 
export default PatientDashboard;
 