import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useCreateMutation,useUpdateUserNewMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './user-validation-schema';
import { Permission, User } from '@/types';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import Alert from '../ui/alert';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { useEffect, useState } from 'react';
import { useCountrysQuery } from '@/data/country';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

type FormValues = {
  image:any,
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  mobile_no: number,
  country:object,
  state:object,
  permission: Permission;
};

const defaultValues = {
  email: '',
  password: '',
};


type IProps = {
  initialValues?: User | undefined;
};

const CustomerCreateForm = ({initialValues}:IProps) => {
  const { t } = useTranslation();
  const { mutate: registerUser, isLoading: loading } = useCreateMutation();

  const { query, locale } = useRouter();

  // const { mutate: createUser,errorMessage,setErrorMessage, isLoading: creating } =
  // useCreateMutation();
  const { mutate: updateUser,errorMessage:errorMessages,setErrorMessage:setErrorMessages, isLoading: updating } =
  useUpdateUserNewMutation();


  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    // defaultValues,
    defaultValues: initialValues
    ? {
        ...initialValues,
      } : defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  const router = useRouter();
  const [status, setStatus] = useState<String>(initialValues?.status);
  const [photoUpload, setPhotoUpload] = useState<String>("");
  const [errorMessage,setErrorMessage] = useState<String>("");


  useEffect(()=>{
    setStatus(initialValues?.status);
  },[initialValues])

  const photoChange = (e:any) => {
    setPhotoUpload(e.target.files);
  }

  async function onSubmit({ 
    // image,
    first_name,
    last_name,
    email,
    password,
    mobile_no,
    country,
    state,
   }: FormValues) {

    //  const input = {
    //   first_name:first_name,
    //   last_name:last_name,
    //   email:email,
    //   password:password,
    //   mobile_no:mobile_no,
    //   country:country,
    //   state:state,
    // };
   let image = photoUpload;


    if(query?.action?.toString() !== 'edit'){
      // createPage({
      //     ...input
      //   });
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
          status:status
        },
        // {
        //   image,
        //   first_name,
        //   last_name,
        //   email,
        //   password,
        //   mobile_no,
        //   country,
        //   state,
        //   status,
        //   // name,
        //   // user_name,
        //   // email,
        //   // password,
        //   // permission: Permission.StoreOwner,
        // },
        {
          onSuccess: (data) => {
            setErrorMessage(null);
            Router.push(Routes.user.list);
            return;
          },
          onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message);
            // setError('password', {
            //   type: 'manual',
            //   message: error?.response?.data?.message,
            // });
            // Object.keys(error?.response?.data).forEach((field: any) => {
            //   setError(field, {
            //     type: 'manual',
            //     message: error?.response?.data[field][0],
            //   });
            // });
          },
        }
      );
      } else {
        updateUser({
          id: initialValues?._id!,
          input: {
            image:photoUpload,
            first_name:first_name,
            last_name:last_name,
            mobile_no:mobile_no,
            country:JSON.stringify(countryData),
            state:JSON.stringify(newStateData),
            email:email,
            status:status
          },
        // updatePage({
        //   ...input,
        //   id: initialValues?._id!,
        // });
      });
    }
    
  }

  const statusChange = (e:any) => {
    setStatus(e.value);
  }


  const { countries, paginatorInfo,  error } = useCountrysQuery({
    limit: 10000,
  });


  const [stateData, setStateData] = useState<array | null>([initialValues?.state]);
  const [countryData, setCountryData] = useState<object | null>(initialValues?.country);
  const [newStateData, setNewStateData] = useState<object | null>(initialValues?.state);
      


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

  // const checkEdit = query?.action?.toString() !== 'edit' ? 'readOnly' : ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        {/* <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        /> */}

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

            <Label>Image</Label>
            <Input
              type="file"  
              // label={t('text-image')}
              {...register('image')}
              // variant="inline"
              className="mb-4"
              error={t(errors.image?.message!)}
              onChange={photoChange}
              // error={t(errors?.first_name?.message!)}
            />

            {initialValues?.image ?
              <img src={initialValues?.image} alt="" height="100px" width="100px" className="mb-4"/>
             : "" 
            }

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
        {query?.action?.toString() !== 'edit' ?
            <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors?.email?.message!)}
           
          /> : 
            <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors?.email?.message!)}
            readOnly
            style={{background:'lightgrey'}}
          />
        }
       
        {!initialValues && <PasswordInput
          label={t('form:input-label-password')}
          {...register('password')}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
          maxLength={16}
        />}
        
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
                value={[countryData]}
                // defaultValue={[initialValues?.country]}
              />

              <Label>State</Label>
              <Select
                name='state'
                getOptionLabel={(option: any) => option?.states}
                getOptionValue={(option: any) => option?.states}
                isMulti={false}
                options={stateData}
                className="mb-4"
                onChange={changeState}
                // value={stateData}
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

              <Label>Status</Label>
              <Select
                options={[
                  { id: '1', value: 'inactive', label: 'Inactive' },
                  { id: '2', value: 'active', label: 'Active' },
                ]}
                onChange={statusChange}
                value={status == 'active' || status == undefined ? { id: '2', value: 'active', label: 'Active' } :  { id: '1', value: 'inactive', label: 'Inactive' }}
                // defaultValue={initialValues?.status == 'active' || initialValues?.status == undefined ? { id: '2', value: 'active', label: 'Active' } :  { id: '1', value: 'inactive', label: 'Inactive' }}
                name="status"
              />
          {/* <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
          />
           <Input
            label={t('form:input-label-user_name')}
            {...register('user_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.user_name?.message!)}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-4"
          /> */}
        </Card>
      </div>

      <div className="text-end mb-4">
      <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-save')}
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;
