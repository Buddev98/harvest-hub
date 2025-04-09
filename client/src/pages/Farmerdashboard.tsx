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
  const [orders, setOrders] = useState<any[]>([]);
  console.log("santosh",orders)
 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/allproductsfarm");
        setOrders(res.data);
      } catch (err) {
        alert("Failed to load orders");
      }
    };
 
    fetchOrders();
  }, []);
 
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Produce Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{order.name}</h3>
              <p>Quantity: {order.quantity} kg</p>
              <p>Price: ₹{order.pricePerKg} /kg</p>
             <p>category: {order.category}</p>
              <p className="text-sm text-gray-600">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
                        
          ))}
        </div>
      )}
    </div>
  );
}