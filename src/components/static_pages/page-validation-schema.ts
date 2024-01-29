import * as yup from 'yup';

export const pageValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-title-required').trim(),
  // slug: yup.string().required('form:error-slug-required'),
  // type: yup.object().nullable().required('form:error-type-required'),
});
