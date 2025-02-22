export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number
) => {
  const { size, type } = file;

  if (size > maxSize) {
    return {
      valid: false,
      message: `File must be smaller than ${maxSize / (1024 * 1024)} MB`,
    };
  }

  if (!allowedTypes.includes(type)) {
    return {
      valid: false,
      message: `Only ${allowedTypes.join(", ")} files are allowed`,
    };
  }

  return { valid: true, message: "" };
};
