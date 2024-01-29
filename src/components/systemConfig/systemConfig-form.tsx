import Input from '@/components/ui/input';
import {
  Control,
  FieldErrors,
  useForm,
  useFormState,
  useWatch,
} from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import * as categoriesIcon from '@/components/icons/category';
import { getIcon } from '@/utils/get-icon';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useEffect } from 'react';
import { Country } from '@/types';
import { SystemConfig } from '@/types';
// import { pageIcons } from './product-price-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { countryValidationSchema } from './country-validation-schema';
import {
  useCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,

} from '@/data/country';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Select from '../ui/select/select';
import { useCreateSystemConfigMutation, useUpdateSystemConfigMutation, } from '@/data/system-config';
import { systemConfigValidationSchema } from './systemConfig-validation-schema';




type FormValues = {
  image: any,
  name: string,
  price: string,
  url: string,
  
};

const defaultValues = {
  image: "",
  name: "",
  price: "",
  url: "",
  
};

type IProps = {
  initialValues?: SystemConfig | undefined;
};
export default function SystemConfigOrUpdateForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;

  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');

  const router = useRouter();
  const { query, locale } = useRouter();

  const [photoUpload, setPhotoUpload] = useState<String>("");
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
        ...initialValues,
        // image: initialValues?.image
        //   ? pageIcons.find(
        //       (singleIcon) => singleIcon.value === initialValues?.image!
        //     )
        //   : '',
        // ...(isNewTranslation && {
        //   type: null,
        // }),
      }
      : defaultValues,
    resolver: yupResolver(systemConfigValidationSchema),
  });

  const [slugData, setSlugData] = useState<string | null>(initialValues?.slug);

  const { mutate: createPage, errorMessage, setErrorMessage, isLoading: creating } =
    useCreateSystemConfigMutation();
  const { mutate: updatePage, errorMessage: errorMessages, setErrorMessage: setErrorMessages, isLoading: updating } =
    useUpdateSystemConfigMutation();

  // let descriptionData = initialValues?.body_content;
  // const changeDescription = (e) => {
  //   descriptionData = e;
  // }

  const capitalizeFLetter = (name: string) => {
    return name?.charAt(0).toUpperCase() +
      name?.slice(1)
  }

  const onSubmit = async (values: FormValues) => {

    const input = {
      name: capitalizeFLetter(values?.name.toLowerCase()),
      image: (values?.image != null && typeof values?.image != 'string') ? values?.image.length != 0 ? values?.image[0] : photoUpload : photoUpload,
      status: status,
      // price: values?.price,
      url: values?.url,
    };
    // if (
    //   !initialValues ||
    //   !initialValues?.translated_languages?.includes(router.locale!)
    // ) {
    if (query?.action?.toString() !== 'edit') {
      createPage({
        ...input
      });
    } else {
      updatePage({
        ...input,
        id: initialValues?._id!,
      });
    }
    // reset();
  };

  const photoChange = (e: any) => {
    setPhotoUpload(e.target.files);
  }

  const statusChange = (e: any) => {
    setStatus(e.value);
  }
  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  return (
    // <form onSubmit={onSubmit}>
    <form onSubmit={handleSubmit(onSubmit)} >

      <div className="my-5 flex flex-wrap sm:my-8">

        <Card className="w-full sm:w-12/12 md:w-3/3">
          {errorMessages ? (
            <Alert
              message={errorMessages}
              variant="error"
              closeable={true}
              className="mt-5 mb-5"
              onClose={() => setErrorMessages(null)}
            />
          ) : null}
          {errorMessage ? (
            <Alert
              message={errorMessage}
              variant="error"
              closeable={true}
              className="mt-5 mb-5"
              onClose={() => setErrorMessage(null)}
            />
          ) : null}
          <Label style={{display: 'flex',gap: '5px'}}>{t('form:input-label-image')}* <img src="/info-icon-svgrepo-com.svg" alt="" style={{height: '15px',width: '15px'}}   onMouseEnter={onHover}  onMouseLeave={onLeave}/> {hover ? <span style={{fontSize: '11px'}}>Only JPG, PNG, TIF files are allowed</span> : ''} </Label>
          <Input
            type="file"
            // label={`${t('form:input-label-image')}*`}
            // {...register('image')}
            name="image"
            // error={t(errors.image?.message!)}
            variant="outline"
            className="mb-5"
            onChange={photoChange}
          // required
          />
           {
            photoUpload == '' && Object.keys(errors).length != 0 ? <span style={{ color: "red", fontSize: "12px" }} className="mb-2">Image is required</span> : ''
          }

          {initialValues?.image ?
            <img src={initialValues?.image} alt="" height="100px" width="100px" className="mb-4" />
            : ""
          }
          <br />
          <label >{`${t('form:input-label-system-Config')}*`}</label>
          <Input
            // label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            maxLength={30}
          />
          <label>{`${t('form:input-label-Social-Media-URL')}*`}</label>
          <Input
            // label={t('form:input-label-name')}
            {...register('url')}
            error={t(errors.url?.message!)}
            variant="outline"
            className="mb-5"
          // value={slugData}
          />
          <Label>Status</Label>
          <Select
            options={[
              { id: '1', value: 'inactive', label: 'Inactive' },
              { id: '2', value: 'active', label: 'Active' },
            ]}
            onChange={statusChange}
            defaultValue={initialValues?.status == 'active' || initialValues?.status == undefined ? { id: '2', value: 'active', label: 'Active' } : { id: '1', value: 'inactive', label: 'Inactive' }}
            name="status"
            className='cursor-pointer'
          />
        </Card>
      </div>
      <div className="mb-4 text-end">
        {/* {initialValues && ( */}
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>
        {/* )} */}

        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update')
            : t('form:button-label-save')}
        </Button>
      </div>
    </form>
  );
}
