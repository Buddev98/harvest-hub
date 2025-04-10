import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../api";
import Table from '../components/Table';
interface Product {
  _id: string;
  name: string;
  pricePerKg: number;
  quantity: number;
  category: string;
}
 
interface Booking {
  buyerId?: string;
  productId: string;
  quantityBooked: number;
}
 
const AddBooking: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
 
  const columns = [
    { header: "Name", render: (product: Product) => product.name },
   
    { header: "PricePerKg", render: (product: Product) => product.pricePerKg },
    { header: "Quantity", render: (product: Product) => product.quantity },
    { header: "category", render: (product: Product) => product.category}
   
  ];
  const renderRowActions = (product: Product) => (
    <button
      className="text-white bg-blue-500 rounded hover:bg-blue-600 p-2"
      onClick={() => setSelectedProduct(product)}
    >
     Buy
    </button>
  );
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/product');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
 
    fetchProducts();
  }, []);
 
  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && quantity > 0) {
      try {
        const booking: Booking = {
          productId: selectedProduct._id,
          quantityBooked: quantity,
        };
        await api.post('/book', booking);
        alert('Booking successful!');
        setSelectedProduct(null);
        setQuantity(0);
      } catch (err) {
        alert('Failed to create booking');
      }
    }
  };
 
 
 
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
   
      <div>
      {loading ? (
          <p>Loading...</p>
        ) :products.length === 0 ? (
          <p>There are no products</p>
        ) : (
      <Table<Product>
      data={products}
      columns={columns}
      renderRowActions={renderRowActions}
     
    />
        )}
    </div>
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Buy {selectedProduct.name}</h3>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">
                Quantity:
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-green-500 text-white rounded p-2 hover:bg-green-600">
                  Submit
                </button>
                <button type="button" onClick={() => setSelectedProduct(null)} className="bg-red-500 text-white rounded p-2 hover:bg-red-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default AddBooking;