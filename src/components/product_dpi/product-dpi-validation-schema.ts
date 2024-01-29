import * as yup from 'yup';

export const pageValidationSchema = yup.object().shape({
  name:yup.string().required('form:error-dpi-required'),
  // price:yup.number().typeError('form:error-price-required').required('form:error-price-required').min(1),
  // price:yup.number().required('form:error-price-required').integer('fdsfds'),
  // .typeError('Price is required and it should be number'),
  // title: yup.string().required('form:error-title-required'),
  // type: yup.object().nullable().required('form:error-type-required'),
});
