import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { login } from "../redux/authSlice";
import Form from "../components/Form";
import { useToast } from "../hooks/useToast";
import { AxiosError } from "axios";
import Loader from "../components/Loader";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const fields: {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "dropdown";
    placeholder?: string;
    validation: (value: string) => string | null;
    options?: string[];
  }[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
      validation: (value: string) =>
        value.trim().length === 0 ? "Username is required." : null,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validation: (value: string) =>
        value.trim() === ""
          ? "Password is required."
          : value.length < 6
          ? "Password must be at least 6 characters long."
          : null,
    },
  ];

  useEffect(() => {
    document.title = "Harvest Hub - Login";
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [setLoading]);

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await api.post("/login", formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(login(response.data));
      if(response.data.role == "buyer"){
        navigate("/products");
      }else{
        navigate("/dashboard");
      }
     
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showToast("error", error?.response?.data.message, {
          position: "top-center",
        });
      } else {
        console.log("Error Logging In:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[500px] mx-auto bg-gray-100 rounded">
      {loading ? (
        <Loader />
      ) : (
        <Form
          formLabel="Login"
          fields={fields}
          onSubmit={handleSubmit}
          submitButtonLabel="Login"
          formWidth="400px"
        />
      )}
    </div>
  );
};

export default LoginForm;