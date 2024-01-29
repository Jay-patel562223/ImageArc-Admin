import * as yup from 'yup';

export const pageValidationSchema = yup.object().shape({
  name:yup.string().required('form:error-name-required'),
  // dpi:yup.object().required('form:error-dpi-required').nullable(),
  price:yup.number().typeError('form:error-price-required').required(),
  // price:yup.number().required('form:error-price-required').integer('fdsfds'),
  // .typeError('Price is required and it should be number'),
  // title: yup.string().required('form:error-title-required'),
  // type: yup.object().nullable().required('form:error-type-required'),
});
