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
import { useEffect, useRef } from 'react';
import { PackageType } from '@/types';
// import { pageIcons } from './product-price-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { pacakgeTypeValidationSchema } from './package_type-validation-schema';
import {
  usePackageTypeQuery,
  useCreatePackageTypeMutation,
  useUpdatePackageTypeMutation,
} from '@/data/package_type';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Select from '../ui/select/select';



type FormValues = {
  name:string,
  price:string,
};

const defaultValues = {
  name:"",
  price:"",
};
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type IProps = {
  initialValues?: PackageType | undefined;
};
export default function CreateOrUpdatePackageTypeForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;

  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');
    
  const router = useRouter();
  const { query, locale } = useRouter();

   
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
    resolver: yupResolver(pacakgeTypeValidationSchema),
  });

  const [slugData, setSlugData] = useState<string | null>(initialValues?.slug);

  const { mutate: createPage, errorMessage,setErrorMessage,isLoading: creating } =
    useCreatePackageTypeMutation();
  const { mutate: updatePage,errorMessage:errorMessages,setErrorMessage:setErrorMessages, isLoading: updating } =
    useUpdatePackageTypeMutation();

    const [des, setDes] = useState<String | undefined>(initialValues?.description);

    // let descriptionData = initialValues?.description ?? '';
    const changeDescription = (e:any) => {
        // descriptionData = e;
        setDes(e);
    }
    // let descriptionData = initialValues?.description;
    // const changeDescription = (e) => {
    //   descriptionData = e;
    // }

  const onSubmit = async (values: FormValues) => {
  
  

    const input = {
      name: values?.name,
      // price: values?.price,
      description: des,
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


  const reactQuillRef = useRef();
  const checkCharacterCount = (event:any) => {
    
    let count = removeTags(des)?.length;
    if (count > 249 && event.key !== 'Backspace'){
      event.preventDefault();
    }
   
  };
  function removeTags(str:any) {
    if ((str===null) || (str==='') || (str === undefined))
        return false;
    else
        str = str.toString();
          
    return str.replace( /(<([^>]+)>)/ig, '');
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

        <label >{`${t('form:input-label-name')}*`}</label>
          <Input
            // label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            maxLength={30}
          />

        <label style={{color:"rgb(75, 85, 99)",fontSize:'15px'}}><b>Description</b></label>

        <ReactQuill 
        theme="snow"
        onKeyDown={checkCharacterCount}
        ref={reactQuillRef}
             {...register('description')}  style={{height:'150px'}} className="mb-10" onChange={changeDescription} onBlur={()=>{}} value={des}
               />
        {/* <QuillNoSSRWrapper {...register('description')} theme="snow" style={{height:'150px'}} className="mb-10" onChange={changeDescription} onBlur={()=>{}} value={descriptionData}/> */}
          {/* {
            (descriptionData == undefined || descriptionData.length == 0) && Object.keys(errors).length != 0 ? <span style={{color:"red",fontSize: "12px"}}>Description is required.</span> : ''
          } */}
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
         
         <Label style={{marginTop:'70px'}}>Status</Label>
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
