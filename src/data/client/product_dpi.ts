import {
  Price,
  PricePaginator,
  PriceQueryOptions,
  CreatePriceInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const dpiClient = {
  ...crudFactory<Price, QueryOptions, CreatePriceInput>(
    API_ENDPOINTS.PRODUCT_DPI
  ),
  paginated: ({ type, name, ...params }: Partial<PriceQueryOptions>) => {
    return HttpClient.get<PricePaginator>(API_ENDPOINTS.PRODUCT_DPI, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
