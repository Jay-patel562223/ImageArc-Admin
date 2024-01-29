import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const customerValidationSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first_name-required').trim(),
  last_name: yup.string().required('form:error-last_name-required').trim(),
  mobile_no: yup.string().required('form:error-mobile-required').matches(phoneRegExp, 'form:error-mobile-not-valid-required').min(10, "please enter minimum 10 digit mobile number")
  .max(10, "please enter maximum 10 digit mobile number").trim(),
  // country: yup.string().required('form:error-country_name-required'),
  // state: yup.string().required('form:error-state_name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required').trim(),
  // password: yup.string().required('form:error-password-required'),
});
