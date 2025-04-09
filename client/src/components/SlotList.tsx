import React from 'react';

interface SlotListProps {
  slots: { date: string, timeSlots: string[] }[];
}

const SlotList: React.FC<SlotListProps> = ({ slots }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md mt-4">
      <h2 className="text-xl font-bold mb-4">Available Slots</h2>
      {slots.map((slot, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold">{slot.date}</h3>
          <ul>
            {slot.timeSlots.map((timeSlot, idx) => (
              <li key={idx} className="inline-block me-2 p-1 bg-gray-200 rounded-md mt-1">{timeSlot}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SlotList;
