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
import { Subscription } from '@/types';
// import { pageIcons } from './product-price-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { subscriptionValidationSchema } from './subscription-validation-schema';
import {
  useSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '@/data/subscription';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Select from '../ui/select/select';
import { useGetAllProductPrice, usePackageTypesQuery } from '@/data/package_type';



type FormValues = {
  package_type:string,
  file_type:string,
  qnty:number,
  price:string,
};

const defaultValues = {
  package_type:'',
  file_type:'',
  qnty:'',
  price:'',
};

type IProps = {
  initialValues?: Subscription | undefined;
};

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


export default function CreateOrUpdateSubscriptionForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;
  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');
    
  const router = useRouter();
  const { query, locale } = useRouter();

  const { packageType, paginatorInfo, loading, error } = usePackageTypesQuery({
    limit: 1000000000,
    // prices,
    // page,
    // type,
    // name: searchTerm,
    // orderBy,
    // sortedBy,
    // language: locale,
  });
  
  const {
    fileType,
    isLoading: loading1,
    // error1,
  } = useGetAllProductPrice();
  

   
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
    resolver: yupResolver(subscriptionValidationSchema),
  });

  const [slugData, setSlugData] = useState<string | null>(initialValues?.slug);

  const { mutate: createPage, errorMessage,setErrorMessage,isLoading: creating } =
    useCreateSubscriptionMutation();
  const { mutate: updatePage,errorMessage:errorMessages,setErrorMessage:setErrorMessages, isLoading: updating } =
    useUpdateSubscriptionMutation();

    
   
    // let descriptionData = initialValues?.description;
    // const changeDescription = (e) => {
    //   descriptionData = e;
    // }
    const [des, setDes] = useState<String | undefined>(initialValues?.description);

    // let descriptionData = initialValues?.description ?? '';
    const changeDescription = (e:any) => {
        // descriptionData = e;
        setDes(e);
    }

  const onSubmit = async (values: FormValues) => {
  

    const input = {
      package_type:values?.package_type,
      file_type:values?.file_type?._id,
      qnty:values?.qnty,
      price:values?.price,
      status: status
    };
   
    
    // if (
    //   !initialValues ||
    //   !initialValues?.translated_languages?.includes(router.locale!)
    // ) {
    if(query?.action?.toString() !== 'edit'){
    createPage({ ...input});
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

 

  // const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
  //   ssr: false,
  //   loading: () => <p>Loading ...</p>,
  //   })


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

              <Label >Package Type</Label>
              <SelectInput
                name="package_type"
                // isMulti
                control={control}
                getOptionLabel={(option: any) => option?.name}
                getOptionValue={(option: any) => option?.name}
                // @ts-ignore
                options={packageType}
                isLoading={loading}
                // onChange={changeValue}
              />

              {/* <Label >File Type</Label>
              <SelectInput
                name="file_type"
                // isMulti
                control={control}
                getOptionLabel={(option: any) => option?.name}
                getOptionValue={(option: any) => option?.name}
                // @ts-ignore
                options={packageType}
                isLoading={loading}
                // onChange={changeValue}
              /> */}
          {/* <Input
            label={t('form:input-label-file_type')}
            {...register('file_type')}
            error={t(errors.file_type?.message!)}
            variant="outline"
            className="mb-5 mt-5"
          /> */}
          <Label className="mt-5">{t('form:input-label-file_type')}</Label>
              <SelectInput
                name='file_type'
                // isMulti
                control={control}
                getOptionLabel={(option: any) => option?.name}
                getOptionValue={(option: any) => option?.name}
                // @ts-ignore
                options={fileType}
                isLoading={loading}
                // onChange={changeValue}
              />

          <Input
            label={t('form:input-label-qnty')}
            type="number"
            {...register('qnty')}
            error={t(errors.qnty?.message!)}
            variant="outline"
            className="mb-5 mt-5"
          />

          <Input
            label={t('form:input-label-price')}
            type="number"
            {...register('price')}
            error={t(errors.price?.message!)}
            variant="outline"
            className="mb-5"
          />
       
         <Label >Status</Label>
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
