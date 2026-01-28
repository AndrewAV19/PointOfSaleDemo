import { useState } from "react";

export const useForm = <T = any>(initialState: T) => {
  const [form, setForm] = useState<T>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm: T) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const setFormField = <K extends keyof T>(field: K, value: T[K]) => {
    setForm((prevForm: T) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialState);
  };

  return {
    form,
    handleChange,
    resetForm,
    setFormField,
    setForm,
  };
};
