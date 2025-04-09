import { IconType } from "react-icons";
import { FaUser } from "react-icons/fa";
import { FaLock, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export const fields: {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "dropdown" | "textarea";
    placeholder?: string;
    icon?: IconType;
    validation: (value: string) => string | null;
    options?: string[];
  }[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
      validation: (value: string) =>
        value.trim().length === 0 ? "Username is required." : value.trim().length < 6 && value.trim().length > 10
      ? "Username must be 6-10 characters long."
      : null,
      icon: FaUser
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      validation: (value: string) => value.trim().length === 0 ? "Email is required." :
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address."
          : null,
      icon: MdEmail
    },
    {
      name: "age",
      label: "Age",
      type: "text",
      placeholder: "Enter your Age",
      validation: (value: string) =>
        value.trim().length === 0
          ? "age is required"
          : !/^\d{2}$/.test(value)
          ? "Invalid age. Please enter a valid number."
          : null,
    },
    {
      name: "experience",
      label: "Experience",
      type: "text",
      placeholder: "Enter your exerience",
      validation: (value: string) =>
        value.trim().length === 0
          ? "Experience is required"
          : !/^\d{2}$/.test(value)
          ? "Please enter a valid number."
          : null,
    },
    {
      name: "gender",
      label: "gender",
      type: "dropdown",
      placeholder: "Please select your gender",
      options: ['male', 'female', 'other'],
      validation: (value: string) => (value ? null : "Gender is required"),
    },
    {
      name: "medicalHistory",
      label: "Medical History",
      type: "textarea",
      placeholder: "Enter your medical history",
      validation: (value: string) => (value ? null : "Please mention your medical history if any else mention N/A"),
    },
    {
      name: "specialization",
      label: "Specialization",
      type: "text",
      placeholder: "Enter your Specialization",
      validation: (value: string) =>
        value.trim().length === 0
          ? "Specialization is required"
          : null,
    },
    {
      name: "phone",
      label: "Contact No",
      type: "text",
      placeholder: "Enter your contact no",
      icon: FaPhone,
      validation: (value: string) =>
        value.trim().length === 0
          ? "Phone number is required"
          : !/^\d{10}$/.test(value)
          ? "Please enter a 10-digit number."
          : null,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validation: (value: string) =>
        value.trim() === ""
          ? "Password is required."
          : value.trim().length < 6 && value.trim().length > 10
          ? "Password must be 6-10 characters long."
          : null,
      icon: FaLock
    },
  ];
  