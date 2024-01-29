import { ProductType } from '@/types';
import * as yup from 'yup';


export const productValidationSchema = yup.object().shape({
  // name: yup.string().required('form:error-name-required'),
  name: yup.string().required('form:error-name-required').trim(),
  // image: yup.mixed().required('File is required'),
  image: yup
  .mixed()
  .test(
    'check-digital-file',
    'form:error-digital-file-input-required',
    (file) => {
      if (!file || !file.original) {
        return true; // No file is selected, so validation passes
      }

      const allowedExtensions = ['png', 'jpg', 'jpeg', 'tif'];
      const fileExtension = file.original.split('.').pop().toLowerCase();

      return allowedExtensions.includes(fileExtension);
    }
  )
  // image: yup.object().required('File is required'),
  // image: yup.object().shape({
  //   file: yup.mixed().required('File is required'),
  // }),
  // categories: yup.array().required('form:error-name-required'),
  // description:yup.string().required('form:error-description-required'),
  // tags: yup.array().required('form:error-name-required'),
  // categories:yup.array().required('form:error-name-required'),
});

// export const productValidationSchema = yup.object().shape({
//   name: yup.string().required('form:error-name-required'),
//   product_type: yup.object().required('form:error-product-type-required'),
//   sku: yup.mixed().when('product_type', {
//     is: (productType: {
//       name: string;
//       value: string;
//       [key: string]: unknown;
//     }) => productType?.value === ProductType.Simple,
//     then: yup.string().nullable().required('form:error-sku-required'),
//   }),
//   price: yup.mixed().when('product_type', {
//     is: (productType: {
//       name: string;
//       value: string;
//       [key: string]: unknown;
//     }) => productType?.value === ProductType.Simple,
//     then: yup
//       .number()
//       .typeError('form:error-price-must-number')
//       .positive('form:error-price-must-positive')
//       .required('form:error-price-required'),
//   }),
//   sale_price: yup
//     .number()
//     .transform((value) => (isNaN(value) ? undefined : value))
//     .lessThan(yup.ref('price'), 'Sale Price should be less than ${less}')
//     .positive('form:error-sale-price-must-positive'),
//   quantity: yup.mixed().when('product_type', {
//     is: (productType: {
//       name: string;
//       value: string;
//       [key: string]: unknown;
//     }) => productType?.value === ProductType.Simple,
//     then: yup
//       .number()
//       .typeError('form:error-quantity-must-number')
//       .positive('form:error-quantity-must-positive')
//       .integer('form:error-quantity-must-integer')
//       .required('form:error-quantity-required'),
//   }),
//   unit: yup.string().required('form:error-unit-required'),
//   type: yup.object().nullable().required('form:error-type-required'),
//   status: yup.string().required('form:error-status-required'),
//   variation_options: yup.array().of(
//     yup.object().shape({
//       price: yup
//         .number()
//         .typeError('form:error-price-must-number')
//         .positive('form:error-price-must-positive')
//         .required('form:error-price-required'),
//       sale_price: yup
//         .number()
//         .transform((value) => (isNaN(value) ? undefined : value))
//         .lessThan(yup.ref('price'), 'Sale Price should be less than ${less}')
//         .positive('form:error-sale-price-must-positive'),
//       quantity: yup
//         .number()
//         .typeError('form:error-quantity-must-number')
//         .positive('form:error-quantity-must-positive')
//         .integer('form:error-quantity-must-integer')
//         .required('form:error-quantity-required'),
//       sku: yup.string().required('form:error-sku-required'),
//       digital_file_input: yup.mixed().when('is_digital', (isDigital) => {
//         if (isDigital) {
//           return yup
//             .object()
//             .test(
//               'check-digital-file',
//               'form:error-digital-file-input-required',
//               (file) => file && file?.original
//             );
//         }
//         return yup.string().nullable();
//       }),
//     })
//   ),
//   digital_file_input: yup.mixed().when('is_digital', (isDigital) => {
//     if (isDigital) {
//       return yup
//         .object()
//         .test(
//           'check-digital-file',
//           'form:error-digital-file-input-required',
//           (file) => file && file?.original
//         );
//     }
//     return yup.string().nullable();
//   }),
// });
