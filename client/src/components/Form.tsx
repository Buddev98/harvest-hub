import React, { ChangeEvent, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FaAngleRight } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiLoginCircleFill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import Loader from "./Loader";

interface InputField {
  icon?: IconType;
  name: string;
  label: string;
  type: "text" | "email" | "password" | "dropdown" | "textarea";
  options?: string[]; // For dropdowns
  placeholder?: string;
  validation?: (value: string) => string | null; // Validation function
}

interface LoginFormProps {
  onSubmit: (data: Record<string, string>) => void;
  fields: InputField[];
  submitButtonLabel: string;
  formLabel: string;
  loading: boolean;
  roles?: { id:string, label: string, value:string }[];
  selectedRole: string, 
  handleRadioChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Form({
  onSubmit,
  fields,
  submitButtonLabel,
  formLabel,
  loading,
  roles,
  selectedRole, 
  handleRadioChange
}: LoginFormProps) {
  const formDataRef = useRef<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    formDataRef.current[name] = value;

    // Validate the field on change
    const field = fields.find((f) => f.name === name);
    if (field?.validation) {
      const error = field.validation(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors: Record<string, string | null> = {};
    fields.forEach((field) => {
      if (field.validation) {
        const error = field.validation(formDataRef.current[field.name] || "");
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (!hasErrors) {
      onSubmit(formDataRef.current);
    }
  };

  const hasErrors = Object.values(errors).some((error) => error !== null);
  const hasValues = Object.values(formDataRef.current).some(
    (val) => val !== undefined && val !== ""
  );

  const LinkIcon = submitButtonLabel === 'Login now' ? IoIosCreate : RiLoginCircleFill;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-500 px-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-700 to-purple-900 opacity-70 z-0" />

        <div className="relative z-10 flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 bg-white p-8">
            {loading ? (<Loader />) : (
            <form onSubmit={handleSubmit} className="w-full">
              <h3 className="font-bold text-gray-700">{formLabel}</h3>
              <div>
                {roles?.map((role) => (
                  <div key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <label htmlFor={role.id} className="font-semibold text-gray-700">
                      {role.label}
                    </label>
                    <input
                      type="radio"
                      id={role.id}
                      value={role.value}
                      name="role"
                      checked={selectedRole === role.value}
                      onChange={handleRadioChange}
                    />
                  </div>
                ))}
              </div>
              {fields.map((input) => {
                const Icon = input.icon;
                return (
                  <div key={input.name} className="mt-4">
                    <label
                      style={{ display: "flex" }}
                      htmlFor={input.name}
                      className="flex items-center gap-2 font-semibold text-gray-700 mb-1"
                    >
                      {Icon && <Icon className="text-purple-600" />}
                      <span>{input.label}</span>
                    </label>
                    {input.type === "dropdown" ? (
                      <select
                        id={input.name}
                        name={input.name}
                        onChange={handleChange}
                        className={`p-2 border w-full ${
                          errors[input.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 ${
                          errors[input.name]
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        }`}
                      >
                        <option value="">Select {input.label}</option>
                        {input.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : input.type === "textarea" ? (
                      <textarea
                        id={input.name}
                        name={input.name}
                        placeholder={input.placeholder}
                        onChange={handleChange}
                        className={`p-2 border w-full ${
                          errors[input.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 ${
                          errors[input.name]
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        }`}
                      />
                    ) : (
                      <input
                        type={input.type}
                        name={input.name}
                        id={input.name}
                        data-testid={input.name}
                        onChange={handleChange}
                        className={`w-full border-b ${
                          errors[input.name]
                            ? "border-red-500"
                            : "border-gray-400"
                        } focus:outline-none ${
                          errors[input.name]
                            ? "focus:ring-red-500"
                            : "focus:border-purple-600"
                        } bg-transparent py-1 text-sm`}
                        placeholder={input.placeholder}
                      />
                    )}
                    {errors[input.name] && (
                      <p className="text-red-500 flex items-center text-sm mt-1">
                        <MdError style={{ marginRight: "5px" }} />
                        {errors[input.name]}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                data-testid='submitBtn'
                style={{ borderRadius: "30px" }}
                className="mt-3 w-full disabled:bg-gray-400 disabled:text-white not-[:hover]:bg-white border border-purple-600 not-[:hover]:text-purple-800 font-semibold py-3 px-6 shadow-md hover:bg-purple-500 hover:text-white flex items-center justify-center gap-2 transition-all duration-200"
                disabled={hasErrors || !hasValues}
              >
                {submitButtonLabel}
                <FaAngleRight className="ml-2" />
              </button>
            </form>
            )}
          </div>

          <div className="md:flex-col md:w-1/3 flex md:justify-end md:items-start items-center p-4 text-white">
            {LinkIcon && <LinkIcon className="text-white me-2" />}
            <Link data-testid='changeBtn' to={submitButtonLabel === 'Login now' ? "/register" : '/'} className="text-white text-sm font-semibold">{submitButtonLabel === 'Login now' ? "New here? SignUp" : "Existing User? SignIn"}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
