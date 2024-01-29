import * as yup from 'yup';

export const categoryValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required').trim(),
  // image: yup
  //       .object()
  //       .test(
  //         'check-digital-file',
  //         'form:error-digital-file-input-required',
  //         (file) => file && file?.original
  //       )
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
  // type: yup.object().nullable().required('form:error-type-required'),
});
