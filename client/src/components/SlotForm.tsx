import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { FaCalendarAlt } from "react-icons/fa";

interface SlotFormProps {
  addSlot: (date: string, timeSlots: string[]) => void;
}

const SlotForm: React.FC<SlotFormProps> = ({ addSlot }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [fromTime, setFromTime] = useState<string | null>(null);
  const [toTime, setToTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleAddTimeSlot = () => {
    if (fromTime && toTime) {
      if (
        new Date(`1970-01-01T${fromTime}`) >= new Date(`1970-01-01T${toTime}`)
      ) {
        setError("From time must be earlier than to time.");
      } else {
        setTimeSlots([...timeSlots, `${fromTime} - ${toTime}`]);
        setFromTime(null);
        setToTime(null);
        setError(null);
      }
    } else {
      setError("Both from and to times are required.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      addSlot(date.toLocaleDateString('en-CA'), timeSlots);
      setDate(null);
      setTimeSlots([]);
    }
  };

  const handleTimeChange = (value: string | null, name: string = 'fromTime') => {
    if (value) {
      const [hoursStr, minutes] = value.split(':');
      console.log(minutes);
      const hours = parseInt(hoursStr, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      if(name === 'fromTime') {
        setFromTime(`${value} ${ampm}`);
      } else {
        setToTime(`${value} ${ampm}`);
      }
    } else {
      console.log('Time cleared');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <label htmlFor="datePicker" className="block font-semibold text-purple-700">Date</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaCalendarAlt style={{ marginRight: "8px" }} />
          <DatePicker
            selected={date}
            ariaLabelledBy="datePicker"
            id="datePicker"
            onChange={(date: Date | null) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="fromTime" className="block font-semibold text-purple-700">Time Slots</label>
        <div className="flex flex-col md:flex-row md:items-center mb-2">
          <TimePicker
            value={fromTime}
            id="fromTime"
            nativeInputAriaLabel="from-time"
            hourAriaLabel="from-hour"
            minuteAriaLabel="from-min"
            amPmAriaLabel="from-ampm"
            onChange={(value) => handleTimeChange(value, 'fromTime')}
            name="fromTime"
            clearIcon={null}
            clockAriaLabel="from-clock"
            data-testid="from"
            format="h:mm a"
            className="mt-1 border rounded-md flex-grow"
          />

          <span className="mx-2">to</span>

          <TimePicker
            value={toTime}
            name="toTime"
            nativeInputAriaLabel="to-time"
            hourAriaLabel="to-hour"
            minuteAriaLabel="to-min"
            amPmAriaLabel="to-ampm"
            clockAriaLabel="to-clock"
            data-testid="to"
            clearIcon={null}
            onChange={(value) => handleTimeChange(value, 'toTime')}
            format="h:mm a"
            className="mt-1 border rounded-md flex-grow"
          />

          <button
            type="button"
            data-testid='add'
            onClick={handleAddTimeSlot}
            style={{ borderRadius: '5px' }}
            className="ms-2 py-1 px-2 font-semibold bg-purple-700 text-white"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="mt-2">
          {timeSlots.map((slot, index) => (
            <li key={index} className="inline-block me-3 p-1 bg-gray-200 rounded-md mt-1">
              {slot}
            </li>
          ))}
        </ul>
      </div>
      <button type="submit" style={{ borderRadius: '5px' }} className="p-2 font-semibold bg-purple-700 text-white">
        Submit
      </button>
    </form>
  );
};

export default SlotForm;
