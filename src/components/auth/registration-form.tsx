import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from '@/components/ui/link';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { Permission } from '@/types';
import { useRegisterMutation } from '@/data/user';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { useCountrysQuery } from '@/data/country';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

type FormValues = {
  image:string,
  first_name:string,
  last_name:string,
  mobile_no:number,
  country:string,
  state:string,
  // name: string;
  // user_name: string,
  email: string;
  password: string;
  // permission: Permission;
};
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const registrationFormSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first_name-required'),
  last_name: yup.string().required('form:error-last_name-required'),
  mobile_no: yup.string().required('form:error-mobile-required').matches(phoneRegExp, 'form:error-mobile-not-valid-required'),
  // mobile_no: yup.number().required('form:error-mobile-required'),
  // country: yup.string().required('form:error-country_name-required'),
  // state: yup.string().required('form:error-state_name-required'),
  // name: yup.string().required('form:error-name-required'),
  // user_name: yup.string().required('form:error-user_name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
  // permission: yup.string().default('store_owner').oneOf(['store_owner']),
});
const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const [photoUpload, setPhotoUpload] = useState<String>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(registrationFormSchema),
    defaultValues: {
      // permission: Permission.StoreOwner,
    },
  });
  const router = useRouter();
  const { t } = useTranslation();
  // const [errorMessage,setErrorMessage] = useState<String>("");

  async function onSubmit({ /*name,user_name,*/
  first_name,
  last_name,
  mobile_no,
  country,
  state,
  email, password /*, permission*/ }: FormValues) {

    let image = photoUpload;

    registerUser(
      {
        image:image,
        first_name:first_name,
        last_name:last_name,
        mobile_no:mobile_no,
        country:JSON.stringify(countryData),
        state:JSON.stringify(newStateData),
        email:email,
        password:password,
      },
      // {
      //   image,
      //   first_name,
      //   last_name,
      //   mobile_no,
      //   country,
      //   state,
      //   // name,
      //   // user_name,
      //   email,
      //   password,
      //   // permission,
      // },

      {
        onSuccess: (data) => {
          if (data?.token) {
            // if (hasAccess(allowedRoles, data?.permissions)) {
              setAuthCredentials(data?.token, data?.permissions);
              router.push(Routes.dashboard);
              return;
            // }
            // setErrorMessage('form:error-enough-permission');
          } else {
            setErrorMessage('form:error-credential-wrong');
          }
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message);
          // Object.keys(error?.response?.data).forEach((field: any) => {
          //   setError(field, {
          //     type: 'manual',
          //     message: error?.response?.data[field],
          //   });
          // });
        },
      }
    );
  }


  const photoChange = (e:any) => {
    setPhotoUpload(e.target.files);
  }


  const { countries, paginatorInfo,  error } = useCountrysQuery({
    limit: 10000,
  });

  const [stateData, setStateData] = useState<array | null>([]);
  const [countryData, setCountryData] = useState<object | null>();
  const [newStateData, setNewStateData] = useState<object | null>();
      

  const changeValue = async (e: any) => {
    setCountryData(e);
   await fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+''+API_ENDPOINTS.STATES_COUNTRY+'/'+e?._id).then( async(res)=>{
     const data = await res.json();
     setStateData(data?.data);
    }).catch((err)=>{
      console.log('err: ',err);

    });
   
  }

  const changeState = (e: any) => {
    setNewStateData(e);
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {errorMessage ? (
        <Alert
          message={errorMessage}
          variant="error"
          closeable={true}
          className="mt-5 mb-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <Label>Image</Label>
            <Input
              type="file"  
              {...register('image')}
              // variant="inline"
              className="mb-4"
              error={t(errors.image?.message!)}
              onChange={photoChange}
              // error={t(errors?.first_name?.message!)}
            />

        <Input
          label={t('form:input-label-first_name')}
          {...register('first_name')}
          variant="outline"
          className="mb-4"
          error={t(errors?.first_name?.message!)}
          maxLength={30}
        />
         <Input
          label={t('form:input-label-last_name')}
          {...register('last_name')}
          variant="outline"
          className="mb-4"
          error={t(errors?.last_name?.message!)}
          maxLength={30}
        />
        <Input
          label={t('form:input-label-email')}
          {...register('email')}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t('form:input-label-password')}
          {...register('password')}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
          maxLength={16}
        />
        <Input
          label={t('form:input-label-mobile')}
          type="number"
          {...register('mobile_no')}
          variant="outline"
          className="mb-4"
          error={t(errors?.mobile_no?.message!)}
        />
        <Label>Country</Label>
              <Select
                name='country'
                getOptionLabel={(option: any) => option?.country}
                getOptionValue={(option: any) => option?.country}
                isMulti={false}
                options={countries}
                // options={countries}
                onChange={changeValue}
                className="mb-4"
                // defaultValue={}
              />
                {/* error={t(errors?.country?.message!)}
              {errors?.country?.message! ? errors?.country?.message! : ''} */}
               <Label>State</Label>
              <Select
                name='state'
                getOptionLabel={(option: any) => option?.states}
                getOptionValue={(option: any) => option?.states}
                isMulti={false}
                options={stateData}
                className="mb-4"
                onChange={changeState}
                defaultValue={stateData}
                // onChange={changeValue}
              />
         {/* <Input
          label={t('form:input-label-country_name')}
          {...register('country')}
          variant="outline"
          className="mb-4"
          error={t(errors?.country?.message!)}
        />
         <Input
          label={t('form:input-label-state_name')}
          {...register('state')}
          variant="outline"
          className="mb-4"
          error={t(errors?.state?.message!)}
        /> */}
        <Button className="w-full" loading={loading} disabled={loading}>
          {t('form:text-register')}
        </Button>

        {/* {errorMessage ? (
          <Alert
            message={t(errorMessage)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMessage(null)}
          />
        ) : null} */}
      </form>
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2">
          {t('common:text-or')}
        </span>
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {t('form:text-already-account')}{' '}
        <Link
          href={Routes.login}
          className="ms-1 font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t('form:button-label-login')}
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
