import React, { useState } from 'react';
import api from '../api';
import { Member } from '../types/interfaces';
import { useToast } from '../hooks/useToast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Member;
  apiEndPoint: string;
}

const Modal = ({ isOpen, onClose, initialData, apiEndPoint}: ModalProps) => {
  const [formData, setFormData] = useState(initialData);
    const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put(`/${apiEndPoint}/${formData._id}`, formData);
      if(response.status === 200) {
        showToast('success', 'Member has been updated sucessfully', { position: "top-right" } )
      }
      console.log('Data updated:', response.data);
      onClose();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700">User Name</label>
            <input   value={formData.username} disabled className="w-full p-2 border rounded  bg-gray-300" />
            <label className="block text-gray-700 mt-4">Select Role</label>
            <select
            className="border p-2 w-full mb-2"
            value={formData.role}
            onChange={handleChange}
            name='role'
            >
              <option value="librarian">Librarian</option>
              <option value="member">Member</option>
            </select>
 
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 ms-2 py-2 bg-blue-500 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;