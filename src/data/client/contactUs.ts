import {
    CreatePageInput,
    QueryOptions,
    ContactUs,
    ContactUsPaginator,
    ContactUsQueryOptions,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { crudFactory } from './curd-factory';
  import { HttpClient } from './http-client';
  
  export const contactUsClient = {
    ...crudFactory<ContactUs, QueryOptions, CreatePageInput>(
      API_ENDPOINTS?.CONTACTUS
    ),
    paginated: ({ type, name, ...params }: Partial<ContactUsQueryOptions>) => {
      return HttpClient.get<ContactUsPaginator>(API_ENDPOINTS?.CONTACTUS, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ type, name }),
      });
    },
  };
  