import React, { ChangeEvent, useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { fields } from "../constants/constants";
import { useLoader } from "../context/LoadingContext";
import { AxiosError } from "axios";
import Form from "../components/Form";
import { IconType } from "react-icons";

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'dropdown' | 'textarea';
  placeholder?: string;
  icon?: IconType;
  validation: (value: string) => string | null;
  options?: string[];
}


const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, showLoader, hideLoader } = useLoader();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [inputs, setInputs] = useState<FormField[]>([]);

  const handleSubmit = async (formData: Record<string, string>) => {
    showLoader();
    try {  

      const res = await api.post("/register", { ...formData, role: selectedRole });        
      if (res.status === 201) {
        navigate("/");
      }
    } catch (error) {
      hideLoader();
      if (error instanceof AxiosError) { 
        showToast("error", error?.response?.data.message, {
          position: "top-center",
        });
      } else {
        console.error("Error during registration:", error);
      }
    } finally {
      hideLoader();
    }
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value);
  };

  useEffect(() => {
    document.title = 'DocConnect - Register';
    if(selectedRole === 'patient') {
      const newFileds = fields.filter(item => (item.name !== 'specialization' && item.name !== 'experience'));
      setInputs(newFileds);
    } else {
      const newFileds = fields.filter(item => item.name !== 'medicalHistory');
      setInputs(newFileds);
    }
  }, [selectedRole]);

  return (
    <Form
      formLabel="Create Account"
      fields={inputs}
      onSubmit={handleSubmit}
      submitButtonLabel={"Register"}
      loading={loading}
      handleRadioChange={handleRadioChange}
      selectedRole={selectedRole}
      roles={[
        { id: 'patient', value: 'patient', label: 'Patient' },
        { id: 'doctor', value: 'admin', label: 'Doctor' }
      ]}
    />
  );
};

export default Register;