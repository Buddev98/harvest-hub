import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../hooks/useToast';
import { AxiosError } from 'axios';

interface User {
  username: string;
  email: string;
  phone: string;
}

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState<User>({
    username: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/users');
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.patch('/users', formData);
      setUser(response.data);
      setIsEditing(false);
      showToast('success', 'Your details have been updated successfuly', { position: 'top-right' });
    } catch (error) {
      if (error instanceof AxiosError) { 
        showToast('error', error?.response?.data?.message, { position: 'top-right' });
      }
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg font-bold mb-2">Username: {user?.username}</p>
          <p className="text-gray-700 text-lg font-bold mb-2">Email: {user?.email}</p>
          <p className="text-gray-700 text-lg font-bold mb-2">Phone: {user?.phone}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
