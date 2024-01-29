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
import { pageIcons } from './page-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { pageValidationSchema } from './page-validation-schema';
import {
  usePageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
} from '@/data/pages';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import Select from '../ui/select/select';


// const [slugData, setSlugData] = useState<string | null>(null);

type FormValues = {
  title:string,
  slug:string,
  body_content:string,
};

const defaultValues = {
  title:"",
  slug:"",
  body_content:"",
};

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type IProps = {
  initialValues?: Page | undefined;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;

    
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
    resolver: yupResolver(pageValidationSchema),
  });

  const [slugData, setSlugData] = useState<string | null>(initialValues?.slug);

  const { mutate: createPage, isLoading: creating } =
    useCreatePageMutation();
  const { mutate: updatePage, isLoading: updating } =
    useUpdatePageMutation();

    // let descriptionData = initialValues?.body_content;
    // const changeDescription = (e) => {
    //   descriptionData = e;
    // }
    const [des, setDes] = useState<String | undefined>(initialValues?.body_content);

    // let descriptionData = initialValues?.description ?? '';
    const changeDescription = (e:any) => {
        // descriptionData = e;
        setDes(e);
    }
    const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');


  const onSubmit = async (values: FormValues) => {
    

    const input = {
      title: values?.title,
      slug: slugData,
      body_content: des,
      status:status
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

  const updateSlug = (e) => {
    let str = e.target.value;
    str = str.replaceAll(' ','_');
    str = str.toLowerCase();
    setSlugData(str);
  }

 const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
  //   ssr: false,
  //   loading: () => <p>Loading ...</p>,
  //   })


  const statusChange = (e:any) => {
    setStatus(e.value);
  }

  return (
    // <form onSubmit={onSubmit}>
    <form onSubmit={handleSubmit(onSubmit)} >
     
      <div className="my-5 flex flex-wrap sm:my-8">

        {/* <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        /> */}
        <Card className="w-full sm:w-12/12 md:w-3/3">
          
        <label >{`${t('form:input-label-title')}*`}</label>
          <Input
            // label={t('form:input-label-name')}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
            onChange={updateSlug}
            maxLength={30}
          />
        <label >{`${t('form:input-label-slug')}`}</label>
          <Input
            // label={t('form:input-label-name')}
            {...register('slug')}
            error={t(errors.slug?.message!)}
            variant="outline"
            className="mb-5"
            value={slugData}
            readOnly
          />
          <label >Description</label>

          <ReactQuill 
             {...register('body_content')} theme="snow"
             modules={modules}
             formats={formats}
           style={{height:'250px'}} className="mb-10" onChange={changeDescription} onBlur={()=>{}} value={des}
               />

          {/* <QuillNoSSRWrapper {...register('body_content')} theme="snow"
            modules={modules}
            formats={formats}
          style={{height:'250px'}} className="mb-10" onChange={changeDescription} onBlur={()=>{}} value={initialValues?.body_content}/> */}
         
         <Label style={{marginTop:'70px'}}>Status</Label>
              <Select
              // className="mt-10 mb-5"
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
