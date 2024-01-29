import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useActiveCategoriesQuery, useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import {  PAGELIMIT } from '@/utils/constants';
import Select from '@/components/ui/select/select';

interface Props {
  control: Control<any>;
  error:any;
  errors:any;
  setCategoryData:any;
  categoryData:any;
}

const ProductCategoryInput = ({ control, error,errors,setCategoryData,categoryData }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation('common');
  // const type = useWatch({
  //   control,
  //   name: 'type',
  // });
  // const { dirtyFields } = useFormState({
  //   control,
  // });
  // useEffect(() => {
  //   if (type?._id && dirtyFields?.type) {
  //     setValue('categories', []);
  //   }
  // }, [type?._id]);

  const { categories, loading } = useActiveCategoriesQuery({
    limit: PAGELIMIT,
    // type: type?._id,
    language: locale,
  });

  const changeValue = (e:any) => {
    // setCategory()
    setCategoryData((res)=> [...res,e?.target?.value]);
    // setCategoryData(e?.target?.value);
  }


  return (
    <div className="mb-5">
      <Label>{`${t('form:input-label-categories')}*`}</Label>
      <SelectInput
        name="categories"
        isMulti
        control={control}
        getOptionLabel={(option: any) => option?.name}
        getOptionValue={(option: any) => option?.name}
        // @ts-ignore
        options={categories}
        isLoading={loading}
        // value={categoryData}
        // onInputChange={changeValue}
        // onChange={changeValue}
      />
      {/* <Select
          name="categories"
          control={control}
          options={categories}
          isLoading={loading}
          getOptionLabel={(option: any) => option?.name}
          getOptionValue={(option: any) => option?.name}
          onChange={changeValue}
          isMulti
        /> */}
      {/* {
        (categoryData == undefined || categoryData.length == 0) && Object.keys(errors).length != 0 ? <span style={{color:"red",fontSize: "12px"}}>Categories is required</span> : ''
      } */}

    </div>
  );
};

export default ProductCategoryInput;
