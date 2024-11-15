import { useState } from "react";

function useFormValues(initialValues: { [key: string]: string }) {
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange =
    (inputName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [inputName]: event.target.value,
      }));
    };

  const resetForm = () => {
    setFormValues(initialValues);
  }

  return { formValues, handleInputChange, resetForm };
}

export default useFormValues;
