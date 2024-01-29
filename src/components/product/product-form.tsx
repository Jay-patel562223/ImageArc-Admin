import Input from '@/components/ui/input';
import Select from '@/components/ui/select/select';
import TextArea from '@/components/ui/text-area';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { Router, useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from './product-validation-schema';
import ProductVariableForm from './product-variable-form';
import ProductSimpleForm from './product-simple-form';
import ProductGroupInput from './product-group-input';
import ProductCategoryInput from './product-category-input';
import ProductTypeInput from './product-type-input';
import { ProductType, Product, ProductInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from './product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import { useEffect, useMemo, useRef, useState } from 'react';
import ProductAuthorInput from './product-author-input';
import ProductManufacturerInput from './product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { split, join } from 'lodash';
import { useCategoriesQuery } from '@/data/category';
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import * as yup from 'yup';
import Form from '@/components/ui/forms/form';
// import ReactQuill from 'react-quill';
import ISVG from '../../../public/info-icon-svgrepo-com.svg'
import Image from 'next/image';

type ProductFormProps = {
  initialValues?: Product | null;
};

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


// const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
//   })

export default function CreateOrUpdateProductForm({
  initialValues,
}: ProductFormProps) {

  // initialValues = initialValues?.data;
  const router = useRouter();

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    }
  );


  // const productFormSchema = yup.object().shape({
  //   // image: yup.string().required('form:error-name-required'),
  //   name: yup.string().required('form:error-name-required'),
  //   // categories: yup.string().required('form:error-categories-required'),
  //   // description: yup.string().required('form:error-name-required'),
  //   // tags: yup.string().required('form:error-name-required'),
  // });


  const shopId = shopData?.id!;
  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(productValidationSchema),
    // @ts-ignore
    defaultValues: initialValues,
    // defaultValues: async () => {
    //   return {
    //     values: initialValues,
    //     resetOptions: {
    //       keepDirtyValues: true,
    //     }
    //   }
    // }

  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = methods;


  const [tags, setTags] = useState<Array>([]);


  const [categoryData, setCategoryData] = useState<String>(initialValues?.categories);
  const [pstatus, setPstatus] = useState<String>(initialValues?.product_status);
  // const [pstatus, setPstatus] = useState<String>(initialValues?.product_status ?? 'pending');
  const [status, setStatus] = useState<String>(initialValues?.status ?? 'active');
  const [newDescriptionData, setNewDescriptionData] = useState<String>("");
  const [photoUpload, setPhotoUpload] = useState<String>("");
  const [des, setDes] = useState<String | undefined>(initialValues?.description);
  const [previewImage, setpreviewImage] = useState<any>("");

  // new
  const [name, setName] = useState<String | undefined>(initialValues?.name);

  useEffect(() => {
    // reset()
    // reset(initialValues)
    setDes(initialValues?.description);
    setPstatus(initialValues?.product_status);
    setName(initialValues?.name);
    setCategoryData(initialValues?.categories);
    reset({ categories: initialValues?.categories })

    // setCategoryData(initialValues?.categories);
    // reset(initialValues?.description)
    // setValue({});
    // router.reload();
  }, [initialValues])



  const { mutate: createProduct, errorMessage, setErrorMessage, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, errorMessage: errorMessages, setErrorMessage: setErrorMessages, isLoading: updating } =
    useUpdateProductMutation();

  const productStatusChange = (e: any) => {
    setPstatus(e.value);
  }


  const statusChange = (e: any) => {
    setStatus(e.value);
  }

  // const reactQuillRef = useRef();
  // let descriptionData = initialValues?.description ?? '';
  const changeDescription = (e: any) => {
    console.log('e: ', e);
    // descriptionData = e;
    // const unprivilegedEditor = reactQuillRef.current.unprivilegedEditor;
    // if (unprivilegedEditor.getLength() > 280 && e.key !== 'Backspace'){
    //   event.preventDefault();
    // }
    setDes(e);
  }

  const changeDescriptionBlur = (e: string) => {
    // setNewDescriptionData(e.length);
  }

  const photoChange = (e: any) => {
    setPhotoUpload(e.target.files);
    setpreviewImage(URL.createObjectURL(e.target.files[0]))
    // onSelectFile(e.target.value);
  }

  // const photoChange = (e: any) => {
  //   const selectedFile = e.target.files[0];
  //   console.log('Selected File:', selectedFile);
  //   setPhotoUpload(selectedFile);
  //   if (selectedFile) {
  //     const imageUrl = URL.createObjectURL(selectedFile);
  //     console.log('Image URL:', imageUrl);
  //     setpreviewImage(imageUrl);
  //   } else {
  //     setpreviewImage("");
  //   }
  // }


  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline'],
      // ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      // ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    // 'link', 'image'
  ];

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

  const onSubmit = async (values: ProductFormValues) => {


    const inputValues = {
      language: router.locale,
      // ...values,
      tag: tags,
      category_id: values?.categories?._id,
      categories: values?.categories != undefined ? values?.categories.map((res: any) => res._id) : [],
      // categories:values?.categories,
      product_status: pstatus,
      status: status,
      description: (typeof des == "Object") ? '' : des,
      // image: photoUpload,
      image:(values?.image != null && typeof values?.image != 'string') ? values?.image?.length != 0 ? values?.image[0] : photoUpload : photoUpload,
      name: name
    };


    try {

      if (
        !initialValues
      ) {
        //@ts-ignore
        createProduct({
          ...inputValues,
        });
      } else {
        //@ts-ignore
        updateProduct({
          ...inputValues,
          id: initialValues._id!,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);

    }
  };
  const allTags = initialValues?.tag;

  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };
  return (
    <>
      {errorMessages ? (
        <Alert
          message={errorMessages}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessages(null)}
        />
      ) : null}
      {errorMessage ? (
        <Alert
          message={errorMessage}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate encType='multipart/form-data'>
          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Card className="w-full sm:w-12/12 md:w-3/3">
              {/* <FileInput name="image" control={control} multiple={false} /> */}

              {/* <Imagg
          src="/no-result.svg"
          alt={text ? t(text) : t('text-no-result-found')}
          className="w-full h-full object-contain"
          layout="fill"
        /> */}
              <Label style={{ display: 'flex', gap: '5px' }}>{t('form:input-label-image')}* <img src="/info-icon-svgrepo-com.svg" alt="" style={{ height: '15px', width: '15px' }} onMouseEnter={onHover} onMouseLeave={onLeave} /> {hover ? <span style={{ fontSize: '11px' }}>Only JPG, PNG, TIF files are allowed</span> : ''} </Label>

              <Input
                type="file"
                // label={`${t('form:input-label-image')}*`}
                // {...register('image')}
                name="image"
                // error={t(errors.image?.message!)}
                variant="outline"
                className="mb-5"
                onChange={(e: any) => photoChange(e)}
              // required

              />

              {
                photoUpload == '' && Object.keys(errors).length != 0 ? <span style={{ color: "red", fontSize: "12px" }} className="mb-2">Image is required</span> : ''
              }

              <div style={{ content: "", display: 'table', clear: 'both' }}>
                <div style={{
                  float: 'left',
                  // width: '50%',
                  // padding: '10px',
                  // height:"100px" 
                  // width="100px"
                  // height: '300px',
                }}>
                  {initialValues?.image ?
                     <img src={initialValues?.image} alt="initialImage"  width="100px" height="100px" className="mb-4" />
                       : ""
                     //  : <img src={previewImage} alt="previewImage" width="100px" height="100px" className="mb-4" />

                  }
                  {/* {previewImage && 
                      <Image src={previewImage} alt="previewImage" width={100} height={100} className="mb-4" />
                  } */}
                  {/*  */}
                </div>
                {/* <div style={{
                    float: 'right',
                    // width: '50%',
                    paddingLeft: '10px',
                    // height: '300px',
                  }}>
                    {selectedFile && 
                    <> 
                    <img src={preview} height="100px" width="100px" className="mb-4"/> 
                    <span>Selected File</span>
                    </>}
                  </div> */}
              </div>

              <Input
                label={`${t('form:input-label-name')}*`}
                {...register('name')}
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5 mt-5"
                value={name}
                // defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
              // value={name}
              // onChange={(e)=>setName(e.target.value)}
              />
              <Label>Description*</Label>
              <ReactQuill
                theme="snow"
                onKeyDown={checkCharacterCount}
                ref={reactQuillRef}
                // value={descriptionData} onChange={changeDescriptionBlur}
                modules={modules}
                //     formats={formats}
                style={{ height: '250px' }}
                className="mb-10"
                onChange={changeDescription}
                //     // onBlur={changeDescriptionBlur}
                // value={descriptionData}
                value={des}
              // maxLength={30}
              />
              {/* <QuillNoSSRWrapper
                  modules={modules}
                  formats={formats}
                  style={{height:'250px'}} 
                  className="mb-10"
                  onChange={changeDescription}
                  onBlur={changeDescriptionBlur}
                  value={descriptionData}
                />
                {
                  (descriptionData == undefined || descriptionData.length == 0) && Object.keys(errors).length != 0 ? <span style={{color:"red",fontSize: "12px"}}>Description is required.</span> : ''
                } */}


              <ProductTagInput tags={tags} setTags={setTags} allTags={allTags} errors={errors} />



              <ProductCategoryInput control={control} error={t(errors.categories?.message!)} errors={errors} setCategoryData={setCategoryData} categoryData={categoryData} />


              <Label>Product Status</Label>
              <Select
                options={[
                  { id: '0', value: 'pending', label: 'Pending' },
                  { id: '1', value: 'approved', label: 'Approved' },
                ]}
                onChange={productStatusChange}
                value={pstatus == 'pending' || pstatus == undefined ? { id: '0', value: 'pending', label: 'Pending' } : { id: '1', value: 'approved', label: 'Approved' }}
                // defaultValue={pstatus == 'pending' || pstatus == undefined ? { id: '0', value: 'pending', label: 'Pending' } :  { id: '1', value: 'approved', label: 'Approved' }}
                // defaultValue={initialValues?.product_status == 'pending' || initialValues?.product_status == undefined ? { id: '0', value: 'pending', label: 'Pending' } :  { id: '1', value: 'approved', label: 'Approved' }}
                name="product_status"
                className="mb-5"
              />

              {/* <Label>Status</Label>
              <Select
                options={[
                  { id: '1', value: 'inactive', label: 'Inactive' },
                  { id: '2', value: 'active', label: 'Active' },
                ]}
                onChange={statusChange}
                defaultValue={initialValues?.status == 'active' || initialValues?.status == undefined ? { id: '2', value: 'active', label: 'Active' } :  { id: '1', value: 'inactive', label: 'Inactive' }}
                // defaultValue={{ id: '2', value: 'active', label: 'Active' }}
                name="status"
              /> */}

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
            <Button loading={updating || creating}
              disabled={updating || creating}
            >
              {initialValues
                ? t('form:button-label-update')
                : t('form:button-label-save')}
            </Button>
          </div>
          {/* )} */}
          {/* </Form> */}
        </form>

      </FormProvider>
    </>
  );
}
