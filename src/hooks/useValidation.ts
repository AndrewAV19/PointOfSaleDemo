export const useValidation = () => {
  const validateRequiredFields = (
    fields: { [key: string]: any },
    requiredFields: string[]
  ): boolean => {
    return requiredFields.every((field) => !!fields[field]);
  };

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return { validateRequiredFields, validateEmail };
};
