import {
  Country,
  CountryPaginator,
  CountryQueryOptions,
  CreateCountryInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const countryClient = {
  ...crudFactory<Country, QueryOptions, CreateCountryInput>(
    API_ENDPOINTS.COUNTRIES
  ),
  paginated: ({ type, name, ...params }: Partial<CountryQueryOptions>) => {
    return HttpClient.get<CountryPaginator>(API_ENDPOINTS.COUNTRIES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
