import {
    CreateSystemConfigInput,
    QueryOptions,
    SystemConfigPaginator,
    SystemConfigQueryOptions,
    SystemConfig,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  // import { crudFactory } from './curd-factory';
  import { HttpClient } from './http-client';
import { crudFactorySystemConfig } from './curd-factory-systemConfig';
  
  export const systemConfigClient = {
    ...crudFactorySystemConfig<SystemConfig, QueryOptions, CreateSystemConfigInput>(
      API_ENDPOINTS?.SOCIAL_MEDIA
    ),
    paginated: ({ type, name, ...params }: Partial<SystemConfigQueryOptions>) => {
      return HttpClient.get<SystemConfigPaginator>(API_ENDPOINTS?.SOCIAL_MEDIA, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ type, name }),
      });
    },
  };
  