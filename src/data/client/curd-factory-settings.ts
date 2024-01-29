import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';
import { Attachment } from '@/types';

interface LanguageParam {
  language: string;
}

export function crudFactorySettings<Type, QueryParams extends LanguageParam, InputType>(
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
      formData.append('name', data.name);
      if(typeof data.image != 'string'){
        formData.append('image[]', data.image);
      }
      formData.append('description', data.description);

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
    update({ id, ...input }: Partial<InputType> & { id: string }) {

      let formData = new FormData();
      formData.append('name', input.name);
      if(typeof input.image != 'string'){
        formData.append('image[]', input.image);
      } 
      formData.append('description', input.description);

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
