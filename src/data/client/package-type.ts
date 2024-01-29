import {
  PackageType,
  PackageTypePaginator,
  PackageTypeQueryOptions,
  CreatePackageTypeInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const packageTypeClient = {
  ...crudFactory<PackageType, QueryOptions, CreatePackageTypeInput>(
    API_ENDPOINTS.PACKAGETYPE
  ),
  paginated: ({ type, name, ...params }: Partial<PackageTypeQueryOptions>) => {
    return HttpClient.get<PackageTypePaginator>(API_ENDPOINTS.PACKAGETYPE, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
