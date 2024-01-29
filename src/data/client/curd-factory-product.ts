import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';
import { Attachment } from '@/types';

interface LanguageParam {
  language: string;
}

export function crudFactoryProduct<Type, QueryParams extends LanguageParam, InputType>(
  endpoint: string
) {
  return {
    all(params: QueryParams) {
      return HttpClient.get<Type[]>(endpoint, params);
    },
    paginated(params: QueryParams) {
      return HttpClient.get<PaginatorInfo<Type>>(endpoint, params);
    },
    get({ slug, language }: GetParams) {
      return HttpClient.get<Type>(`${endpoint}/${slug}`, { language });
    },
    create(data: InputType) {


       let formData = new FormData();
      formData.append('name', data?.name?.trim());
      if(typeof data?.image != 'string'){
        formData.append('image[]', data.image[0]);
      } 
     formData.append('tag', data?.tag);
     formData.append('category_id', data?.category_id);
    //  formData.append('categories', data?.categories);
     formData.append('categories', JSON.stringify(data?.categories));
     formData.append('description', data?.description?.trim());
     formData.append('price', data?.price);
     formData.append('title', data?.title);
     formData.append('product_status', data?.product_status);
     formData.append('status', data?.status);
     
      
      
     
      // let formData = new FormData();
      // formData.append('name', data.name);
      // if(typeof data.image != 'string'){
      //   formData.append('image[]', data.image);
      // }
      // formData.append('description', data.description);

      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      return HttpClient.post<Attachment>(
        endpoint,
        // data
        formData,
        options
      );
      // return HttpClient.post<Type>(endpoint, data);
    },
    changeStatus(data: InputType) {
     
      // const options = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // };
      return HttpClient.post<Attachment>(
        `${endpoint}/${data?.id}`,
        data
        // formData,
        // options
      );
      return HttpClient.post<Type>(endpoint, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {
       let formData = new FormData();
      formData.append('name', input?.name?.trim());
      if(typeof input?.image != 'string'){
        formData.append('image[]', input.image[0]);
      } 
     formData.append('tag', input?.tag);
     formData.append('category_id', input?.category_id);
     formData.append('categories', JSON.stringify(input?.categories));
     formData.append('description', input?.description?.trim());
     formData.append('price', input?.price);
     formData.append('title', input?.title);
     formData.append('product_status', input?.product_status);
     formData.append('status', input?.status);
     
      // let formData = new FormData();
      // formData.append('name', input.name);
      // if(typeof input.image != 'string'){
      //   formData.append('image[]', input.image);
      // } 
      // formData.append('description', input.description);

      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      return HttpClient.put<Attachment>(
        `${endpoint}/${id}`,
        // input,
        formData,
        options
      );
      // return HttpClient.put<Type>(`${endpoint}/${id}`, input);
    },
    delete({ id }: { id: string }) {
      return HttpClient.delete<boolean>(`${endpoint}/${id}`);
    },
  };
}
