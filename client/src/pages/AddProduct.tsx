import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
 
export default function AddProduct() {
 const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", imageUrl: "", quantity: 0, pricePerKg: 0, category: ""
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
if (!form.name || !form.quantity || !form.pricePerKg || !form.category) {
      alert("All fields are required");
        return;
      }
      if (form.quantity <= 0) {
        alert("Quantity must be greater than 0");
        return;
      }
      if (form.pricePerKg <= 0) {
        alert("Price per Kg must be greater than 0");
        return;
      }
  
    try {
await api.post("/product", form);
console.log("santhu",form)
      alert("Produce added");
      navigate("/FarmerDashboard")
    } catch {
      alert("Failed to add produce");
    }
  };
 
  return (

    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      
      <label className="block mb-2">
        Name
      </label>
      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="block border border-black-900 p-2 mb-2 w-full" />
      <label className="block mb-2">
        Quantity
        <input required type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} placeholder="Quantity" className="block border border-black-900 p-2 mb-2 w-full" />
      </label>
      
      <label className="block mb-2 md:ml-2 lg:ml-2 xl:ml-2">
        Price per Kg
        <input required type="number" value={form.pricePerKg} onChange={e => setForm({ ...form, pricePerKg: Number(e.target.value) })} placeholder="Price per Kg" className="block border border-black-900 p-2 mb-2 w-full" />
      </label>
      <div>
      <label className="block mb-2">
        Category
      </label>
      <input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="block border border-black-900 p-2 mb-2 w-full" />
      </div>
      
      <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
    </form>
    
  );
}