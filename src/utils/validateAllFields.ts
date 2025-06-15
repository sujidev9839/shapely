import { validateField } from './validateField';

export function validateAllFields(formData:any, rules:any) {
  const errors:any = {};

  Object.keys(formData).forEach((fieldName) => {
    const value = formData[fieldName];
    const fieldRules = rules[fieldName] || {};
    const error = validateField(fieldName, value, fieldRules);

    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}
