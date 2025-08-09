const validateNotEmpty = (value: string, fieldName: string) => {
  if (!value || value.trim() === "") {
    return `${fieldName} cannot be empty`;
  }
  return true;
};

export default validateNotEmpty;
