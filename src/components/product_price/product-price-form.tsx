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
import { Page } from '@/types';
import { pageIcons } from './product-price-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { pageValidationSchema } from './product-price-validation-schema';
import {
  usePriceQuery,
  useCreatePriceMutation,
  useUpdatePriceMutation,
} from '@/data/product_prices';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Select from '../ui/select/select';
import { useGetAllProductDpi } from '@/data/product_dpi';



type FormValues = {
  name:string,
  price:string,
  dpi:object
};

const defaultValues = {
  name:"",
  price:"",
  dpi:""
};

type IProps = {
  initialValues?: Page | undefined;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;

  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');
    
  const router = useRouter();
  const { query, locale } = useRouter();

  // console.log('query: ',query.action);

  // const {
  //   dpis,
  //   isLoading: loading1,
  //   // error1,
  // } = useGetAllProductDpi();

   
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
    resolver: yupResolver(pageValidationSchema),
  });

  const [slugData, setSlugData] = useState<string | null>(initialValues?.slug);
  // const [dpiData, setDpiData] = useState(initialValues?.dpi);
  // const [dpiData, setDpiData] = useState<Array>([initialValues?.dpi ?? {_id:'',name:''}]);
  const { mutate: createPage, errorMessage,setErrorMessage,isLoading: creating } =
    useCreatePriceMutation();
  const { mutate: updatePage,errorMessage:errorMessages,setErrorMessage:setErrorMessages, isLoading: updating } =
    useUpdatePriceMutation();

    // let descriptionData = initialValues?.body_content;
    // const changeDescription = (e) => {
    //   descriptionData = e;
    // }


  const onSubmit = async (values: FormValues) => {
  
  

    const input = {
      name: values?.name,
      // dpi:dpiData._id,
      // dpi:dpiData,
      price: Number(values?.price),
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

  const changevalue = async (e: any) => {
    setDpiData(e);
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

        <Label>{t('form:input-label-name')}*</Label>
        {/* <label >{`${t('form:input-label-name')}*`}</label> */}
          <Input
            // label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            disabled={query.action == 'edit'}
            // disabled={initialValues?.name == 'default'}
            maxLength={30}
          />

          {/* <Label>DPI*</Label>
              <Select
               getOptionLabel={(option: any) => option?.name}
               getOptionValue={(option: any) => option?.name}
               isMulti={false}
               options={dpis}
               className="mb-4"
                defaultValue={[dpiData]}
                onChange={changevalue}
                name="dpi"
              /> */}

        <Label>{t('form:input-label-price')}*</Label>
        {/* <label >{`${t('form:input-label-price')}*`}</label> */}
          <Input
            type='number'
            // label={t('form:input-label-name')}
            {...register('price')}
            error={t(errors.price?.message!)}
            variant="outline"
            className="mb-5"
            // pattern="^[0-9\b]+$" 
            // value={slugData}
          />
         
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
