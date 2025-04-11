import { useEffect, useState } from "react";
import api from "../api";

interface Produce {
  name: string;
  pricePerKg: number;
  imageUrl: string;
}

interface Buyer {
  name: string;
  email: string;
}

interface Order {
  _id: string;
  produce: Produce;
  quantity: number;
  buyer: Buyer;
  createdAt: string;
}

export default function FarmerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  console.log("santosh", orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/allproductsfarm");
      setOrders(res.data);
    } catch (err: unknown) {
      alert("Failed to load orders");
      console.log(err);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        await api.delete(`product/${id}`);
        alert("Order canceled");
        fetchOrders();
      } catch {
        alert("Failed to cancel order");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Produce Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded bg-gray-300 shadow-md">
              <h3 className="font-semibold">{order.produce.name}</h3>
              <p>Quantity: {order.quantity} kg</p>
              <p>Price: ₹{order.produce.pricePerKg} /kg</p>
              <p>Category: {order.produce.imageUrl}</p>
              <p className="text-sm text-gray-600">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleCancel(order._id)}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}