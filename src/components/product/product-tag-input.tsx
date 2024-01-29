import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useTagsQuery } from '@/data/tag';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Input from '@/components/ui/input';
// import Tagify from '@yaireo/tagify'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
// import Tagify from '@yaireo/tagify';

interface Props {
  tags:any,
  setTags:any,
  control: Control<any>;
  setValue: any;
  allTags:any;
  errors:any
}

const ProductTagInput = ({tags, setTags, control, setValue,allTags,errors }: Props) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  // const type = useWatch({
  //   control,
  //   name: 'type',
  // });
  // const { dirtyFields } = useFormState({
  //   control,
  // });
  // useEffect(() => {
  //   if (type?.slug && dirtyFields?.type) {
  //     setValue('tags', []);
  //   }
  // }, [type?.slug]);



      const changeData = (e :any) => {
        let arr = [];
        e.detail.tagify.value.map((data: any)=>{
          arr.push(data.value);
        })
        setTags(arr);
       
      }
  return (
    <div style={{marginBottom:'20px',marginTop:'50px'}} >

       <Label>{`${t('sidebar-nav-item-tags')}*`}</Label>
       <Tags
       name="tags"
       style={{width: "-webkit-fill-available"}}
       onChange={changeData}
      value={allTags}
      error={t(errors.tags?.message!)}
    />
      {
        tags.length == 0 && Object.keys(errors).length != 0 ? <span style={{color:"red",fontSize: "12px"}}>Tags is required</span> : ''
      }
    </div>
  );
};

export default ProductTagInput;
function setTags(arg0: (string | import("../../types").Tag)[]) {
  throw new Error('Function not implemented.');
}

