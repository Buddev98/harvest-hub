import { useEffect, useState } from "react";
import api from "../api";
import SlotForm from "../components/SlotForm";
import SlotList from "../components/SlotList";
import { useToast } from "../hooks/useToast";
import { AxiosError } from "axios";

const Dashboard: React.FC = () => {
  const [slots, setSlots] = useState<{ date: string; timeSlots: string[] }[]>([]);
  const { showToast } = useToast();

  const fetchSlots = async () => {
    try {
      const res = await api.get("/slots");
      setSlots(res.data.availableSlots);
    } catch (error) {
      console.error("Error getting slots:", error);
    }
  };

  const handleCreateSlot = async (date: string, timeSlots: string[]) => {
    try {
      const timeSlotsString = timeSlots.join(", ");
      await api.post("/slots/create", { date, timeSlots: timeSlotsString });
      fetchSlots();
      showToast("success", "New slot created successfully", {
        position: "top-right",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast("error", error?.response?.data.message, {
          position: "top-right",
        });
      }
      console.error("Error adding slot:", error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div>
      <SlotForm addSlot={handleCreateSlot} />
      {slots.length > 0 ? <SlotList slots={slots} /> : <p>No Slots Available</p>}
    </div>
  );
};

export default Dashboard;
