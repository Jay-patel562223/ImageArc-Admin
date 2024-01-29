import {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  CreateCategoryInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactoryCategory } from './curd-factory-category';
// import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const categoryClient = {
  ...crudFactoryCategory<Category, QueryOptions, CreateCategoryInput>(
    API_ENDPOINTS.CATEGORIES
  ),
  paginated: ({ type, name, ...params }: Partial<CategoryQueryOptions>) => {
    return HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
  
  paginatedActive: ({ type, name, ...params }: Partial<CategoryQueryOptions>) => {
    return HttpClient.get<CategoryPaginator>(API_ENDPOINTS.ACTIVECATEGORIES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
