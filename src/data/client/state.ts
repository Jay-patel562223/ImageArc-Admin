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

export const stateClient = {
  ...crudFactory<Country, QueryOptions, CreateCountryInput>(
    API_ENDPOINTS.STATES
  ),
  paginated: ({ type, name, ...params }: Partial<CountryQueryOptions>) => {
    return HttpClient.get<CountryPaginator>(API_ENDPOINTS.STATES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
