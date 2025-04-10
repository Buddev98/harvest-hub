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
    <div className="max-w-lg mx-auto mt-10">
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
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
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
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
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
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight "
            />
            {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
          </div>
          <button
            type='button'
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold me-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
          <button
            type='button'
            onClick={() => setIsEditing(false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg font-bold mb-2">Username: <span className='font-semibold'>{user?.username}</span></p>
          <p className="text-gray-700 text-lg font-bold mb-2">Email: <span className='font-semibold'>{user?.email}</span></p>
          <p className="text-gray-700 text-lg font-bold mb-2">Phone: <span className='font-semibold'>{user?.phone}</span></p>
          <button
            type='button'
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
