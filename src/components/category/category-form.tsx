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
import { Category } from '@/types';
import { categoryIcons } from './category-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryValidationSchema } from './category-validation-schema';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/data/category';
import { useTypesQuery } from '@/data/type';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { RESET } from 'jotai/utils';
import { useState } from 'react';
import Alert from '../ui/alert';
import Select from '../ui/select/select';

export const updatedIcons = categoryIcons.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex h-5 w-5 items-center justify-center">
        {getIcon({
          iconList: categoriesIcon,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

function SelectTypes({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { types, loading } = useTypesQuery({ language: locale });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-types')}</Label>
      <SelectInput
        name="type"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.slug}
        options={types!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.type?.message)} />
    </div>
  );
}

function SelectCategories({
  control,
  setValue,
}: {
  control: Control<FormValues>;
  setValue: any;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const type = useWatch({
    control,
    name: 'type',
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('parent', []);
    }
  }, [type?.slug]);
  const { categories, loading } = useCategoriesQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
  });
  return (
    <div>
      <Label>{t('form:input-label-parent-category')}</Label>
      <SelectInput
        name="parent"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={categories}
        isClearable={true}
        isLoading={loading}
      />
    </div>
  );
}

type FormValues = {
  image: any;
  name: string;
  description: string;
  // details: string;
  // parent: any;
  // icon: any;
  // type: any;
};

const defaultValues = {
  image: '',
  name: '',
  description: ''
  // details: '',
  // parent: '',
  // icon: '',
  // type: '',
};

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


type IProps = {
  initialValues?: Category | undefined;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  initialValues = initialValues?.data;
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
        //   ? categoryIcons.find(
        //       (singleIcon) => singleIcon.value === initialValues?.image!
        //     )
        //   : '',
        // ...(isNewTranslation && {
        //   type: null,
        // }),
      }
      : defaultValues,
    resolver: yupResolver(categoryValidationSchema),
  });

  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');

  const { mutate: createCategory, errorMessage, setErrorMessage, isLoading: creating } =
    useCreateCategoryMutation();


  const { mutate: updateCategory, errorMessage: errorMessages, setErrorMessage: setErrorMessages, isLoading: updating } =
    useUpdateCategoryMutation();

    
  const [des, setDes] = useState<String | undefined>(initialValues?.description);

  // let descriptionData = initialValues?.description ?? '';
  const changeDescription = (e: any) => {
    // descriptionData = e;
    setDes(e);
  }

  // let descriptionData = initialValues?.description;
  // const changeDescription = (e) => {
  //   descriptionData = e;
  // }


  const onSubmit = async (values: FormValues) => {



    const input = {
      // language: router.locale,
      name: values?.name,
      // details: values.details,
      image: (values?.image != null && typeof values?.image != 'string') ? values?.image.length != 0 ? values?.image[0] : photoUpload : photoUpload,
      description: des,
      status: status
      // image: {
      //   thumbnail: values?.image?.thumbnail,
      //   original: values?.image?.original,
      //   id: values?.image?.id,
      // },
      // icon: values.icon?.value || '',
      // parent: values.parent?.id ?? null,
      // type_id: values.type?.id,
    };

    // if (
    //   !initialValues ||
    //   !initialValues?.translated_languages?.includes(router.locale!)
    // ) {
    if (query?.action?.toString() !== 'edit') {
      createCategory({
        ...input,
        // ...(initialValues?.slug && { slug: initialValues?.slug }),
      });
    } else {
      updateCategory({
        ...input,
        id: initialValues?._id!,
      });
    }
    // reset();
  };


  // const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
  //   ssr: false,
  //   loading: () => <p>Loading ...</p>,
  //   })


  const photoChange = (e: any) => {
    setPhotoUpload(e.target.files);
  }


  const statusChange = (e: any) => {
    setStatus(e.value);
  }

  const reactQuillRef = useRef();
  const checkCharacterCount = (event: any) => {

    let count = removeTags(des)?.length;
    if (count > 249 && event.key !== 'Backspace') {
      event.preventDefault();
    }

  };
  function removeTags(str: any) {
    if ((str === null) || (str === '') || (str === undefined))
      return false;
    else
      str = str.toString();

    return str.replace(/(<([^>]+)>)/ig, '');
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
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:category-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div> */}

      <div className="my-5 flex flex-wrap sm:my-8">
        {/* <Description
          title={t('form:input-label-image')}
          details={t('form:category-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        /> */}


        {/* <Card className="w-full sm:w-8/12 md:w-2/3"> */}
        {/* <FileInput control={control}/> */}
        {/* <FileInput name="image" control={control} multiple={false} /> */}
        {/* </Card> */}

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
          {/* <Label>Image</Label> */}

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
          {/* <input type="file"  {...register('image')}   className="mb-5"/> */}
          {
            photoUpload == '' && Object.keys(errors).length != 0 ? <span style={{ color: "red", fontSize: "12px" }} className="mb-2">Image is required</span> : ''
          }

          {initialValues?.image ?
            <img src={initialValues?.image} alt="" height="100px" width="100px" className="mb-4" />
            : ""
          }

          <br />
          <Input
            label={`${t('form:input-label-name')}*`}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            maxLength={30}
          />

          {/* <label style={{ color: "rgb(75, 85, 99)", fontSize: '15px' }}><b>Description</b></label> */}

          {/* <ReactQuill
            theme="snow"
            onKeyDown={checkCharacterCount}
            ref={reactQuillRef}
            {...register('description')} style={{ height: '150px' }} className="mb-10" onChange={changeDescription} onBlur={() => { }} value={des}
          /> */}

          {/* <QuillNoSSRWrapper {...register('description')} theme="snow" style={{height:'150px'}} className="mb-10" onChange={changeDescription} onBlur={()=>{}} value={descriptionData}/>
            {
              (descriptionData == undefined || descriptionData.length == 0) && Object.keys(errors).length != 0 ? <span style={{color:"red",fontSize: "12px"}}>Description is required.</span> : ''
            } */}
          {/* <Input
            label={t('form:input-label-image')}
            {...register('image')}
            error={t(errors.image?.message!)}
            variant="outline"
            className="mb-5"
          /> */}


          {/* <TextArea
            label={t('form:input-label-details')}
            {...register('details')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-select-icon')}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div> */}
          {/* <SelectTypes control={control} errors={errors} />
          <SelectCategories control={control} setValue={setValue} /> */}

          <Label>Status</Label>
          <Select
            // className="mt-10 mb-5"
            options={[
              { id: '1', value: 'inactive', label: 'Inactive' },
              { id: '2', value: 'active', label: 'Active' },
            ]}

            onChange={statusChange}
            defaultValue={initialValues?.status == 'active' || initialValues?.status == undefined ? { id: '2', value: 'active', label: 'Active' } : { id: '1', value: 'inactive', label: 'Inactive' }}
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
