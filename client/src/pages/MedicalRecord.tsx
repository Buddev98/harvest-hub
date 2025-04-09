import React, { useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
 
export default function MedicalRecordForm() {
    const { id } = useParams();
    let patientId =  id
  const [form, setForm] = useState({
    diagnosis: '',
    treatment: '',
    notes: '',
    medicines: ''
  });
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async () => {
await api.post('/medical-records', {
      ...form,
      patientId
    });
    alert('Medical Record and Prescription saved!');
    setForm({diagnosis: '',
        treatment: '',
        notes: '',
        medicines: ''})
  };
 
  return (
    <div className="p-4 border rounded bg-white shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Medical Record</h2>
      <input className="border p-2 w-full mb-2" name="diagnosis" placeholder="Diagnosis" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" name="treatment" placeholder="Treatment" onChange={handleChange} />
      <textarea className="border p-2 w-full mb-2" name="notes" placeholder="Notes" onChange={handleChange} />
      <input className="border p-2 w-full mb-4" name="medicines" placeholder="Prescription (e.g. Paracetamol 500mg)" onChange={handleChange} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
    </div>
  );
}