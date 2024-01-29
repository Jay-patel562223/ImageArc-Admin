import * as yup from 'yup';

export const subscriptionValidationSchema = yup.object().shape({
  // package_type:yup.object().required('form:error-package_type-required'),
  // file_type:yup.string().required('form:error-file_type-required'),
  qnty:yup.string().required('form:error-qnty-required'),
  price:yup.string().required('form:error-price-required'),
  // name:yup.string().required('form:error-name-required'),
  // price:yup.number().typeError('form:error-price-required').required('form:error-price-required').min(1),
  // price:yup.number().required('form:error-price-required').integer('fdsfds'),
  // .typeError('Price is required and it should be number'),
  // title: yup.string().required('form:error-title-required'),
  // type: yup.object().nullable().required('form:error-type-required'),
});
