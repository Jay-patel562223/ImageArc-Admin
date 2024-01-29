import {
  Page,
  PagePaginator,
  PageQueryOptions,
  CreatePageInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const pagesClient = {
  ...crudFactory<Page, QueryOptions, CreatePageInput>(
    API_ENDPOINTS.PAGES
  ),
  paginated: ({ type, name, ...params }: Partial<PageQueryOptions>) => {
    return HttpClient.get<PagePaginator>(API_ENDPOINTS.PAGES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
