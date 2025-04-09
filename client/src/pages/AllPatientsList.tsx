import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface Patient {
    _id: string;
    username: string;
    email: string;
    role: string;
    // Add other fields as needed
  }

const PatientsTable = () => {
    const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([]);
  console.log("santosh",patients);
  const handleAddMedicalRecord = (id:any) => {
    navigate(`/medical/${id}`)
  }
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/getpatients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="container mx-auto">
        {patients.length > 0 ? 
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td className="py-2 px-4 border-b">{patient.username}</td>
              <td className="py-2 px-4 border-b">{patient.email}</td>
              <td className="py-2 px-4 border-b">{patient.role}</td>
              <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                    onClick={() => handleAddMedicalRecord(patient._id)}
                  >
                    Add Record
                  </button>
                </td>
              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
      :
      <p>no patients available</p>
        }
    </div>
  );
};

export default PatientsTable;