import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { login } from "../redux/authSlice";
import { useToast } from "../hooks/useToast";
import { AxiosError } from "axios";
import { useLoader } from "../context/LoadingContext";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import Form from "../components/Form";
import { IconType } from "react-icons";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, showLoader, hideLoader } = useLoader();

  const fields: {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "dropdown";
    placeholder?: string;
    validation: (value: string) => string | null;
    options?: string[];
    icon?: IconType
  }[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your registered Username",
      validation: (value: string) =>
        value.trim().length === 0 ? "Username is required." : null,
      icon: FaUser
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
      icon: FaLock
    },
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      showLoader();
      const response = await api.post("/login", formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(login(response.data));
      console.log(response.data);
      if (response.data.role === "patient") {
        navigate("/book");
      }
      else if (response.data.role === "admin") {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      hideLoader();
      if (error instanceof AxiosError) {
        showToast("error", error?.response?.data.message, {
          position: "top-center",
        });
      } else {
        console.log("Error Logging In:", error);
      }
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    document.title = 'DocConnect - Login'
  }, []);
  
  return (
      <Form
      formLabel="Login"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonLabel="Login now"
      loading={loading} selectedRole={""} />
  );
};

export default LoginForm;