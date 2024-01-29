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
import { State } from '@/types';
// import { pageIcons } from './product-price-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { stateValidationSchema } from './state-validation-schema';
import {
  useStateQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
} from '@/data/state';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Select from '../ui/select/select';
import { useCountrysQuery } from '@/data/country';



type FormValues = {
  country_id:object,
  states:string,
  // price:string,
};

const defaultValues = {
  states:"",
  // price:"",
};

type IProps = {
  initialValues?: State | undefined;
};
export default function CreateOrUpdateStateForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;

  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');
    
  const router = useRouter();
  const { query, locale } = useRouter();

  const { countries, paginatorInfo, loading, error } = useCountrysQuery({
    limit: 10000,
    language: locale,
  });
  
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
    resolver: yupResolver(stateValidationSchema),
  });

  const [slugData, setSlugData] = useState<string | null>(initialValues?.slug);

  const { mutate: createPage, errorMessage,setErrorMessage,isLoading: creating } =
    useCreateStateMutation();
  const { mutate: updatePage,errorMessage:errorMessages,setErrorMessage:setErrorMessages, isLoading: updating } =
    useUpdateStateMutation();

    // let descriptionData = initialValues?.body_content;
    // const changeDescription = (e) => {
    //   descriptionData = e;
    // }


  const onSubmit = async (values: FormValues) => {
  
  
    // categories:values?.categories ?? categoryData,
    const input = {
      country_id: values?.country_id,
      // country_id: values?.country_id?._id,
      states: values?.states.toLocaleLowerCase(),
      // price: values?.price,
      status: status
    };
   
    
    // if (
    //   !initialValues ||
    //   !initialValues?.translated_languages?.includes(router.locale!)
    // ) {
    if(query?.action?.toString() !== 'edit'){
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

  const statusChange = (e:any) => {
    setStatus(e.value);
  }


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

          <Label>Country*</Label>
          <SelectInput
            name="country_id"
            // isMulti
            control={control}
            getOptionLabel={(option: any) => option?.country}
            getOptionValue={(option: any) => option?.country}
            // @ts-ignore
            options={countries}
            isLoading={loading}
            // onChange={changeValue}
          />
          <br />
        <label >{`${t('form:input-label-state')}*`}</label>
          <Input
            // label={t('form:input-label-name')}
            {...register('states')}
            error={t(errors.states?.message!)}
            variant="outline"
            className="mb-5"
            maxLength={30}
          />
        {/* <label >{`${t('form:input-label-price')}*`}</label>
          <Input
            type='number'
            // label={t('form:input-label-name')}
            {...register('price')}
            error={t(errors.price?.message!)}
            variant="outline"
            className="mb-5"
            // value={slugData}
          /> */}
         
         <Label>Status</Label>
              <Select
                options={[
                  { id: '1', value: 'inactive', label: 'Inactive' },
                  { id: '2', value: 'active', label: 'Active' },
                ]}
                onChange={statusChange}
                defaultValue={initialValues?.status == 'active' || initialValues?.status == undefined ? { id: '2', value: 'active', label: 'Active' } :  { id: '1', value: 'inactive', label: 'Inactive' }}
                name="status"
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
