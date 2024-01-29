import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';
import { Attachment } from '@/types';

interface LanguageParam {
  language: string;
}

export function crudFactory<Type, QueryParams extends LanguageParam, InputType>(
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
    getNew(url:string) {
      return HttpClient.get<Type>(`${url}`);
    },
    create(data: InputType) {
      
      return HttpClient.post<Attachment>(
        endpoint,
        data
      );
      // return HttpClient.post<Type>(endpoint, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {

      return HttpClient.put<Attachment>(
        `${endpoint}/${id}`,
        input,
      );
      // return HttpClient.put<Type>(`${endpoint}/${id}`, input);
    },
    delete({ id }: { id: string }) {
      return HttpClient.delete<boolean>(`${endpoint}/${id}`);
    },
  };
}
