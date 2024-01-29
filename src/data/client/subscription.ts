import {
  Subscription,
  SubscriptionPaginator,
  SubscriptionQueryOptions,
  CreateSubscriptionInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const subscriptionClient = {
  ...crudFactory<Subscription, QueryOptions, CreateSubscriptionInput>(
    API_ENDPOINTS.SUBSCRIPTION
  ),
  paginated: ({ type, name, ...params }: Partial<SubscriptionQueryOptions>) => {
    return HttpClient.get<SubscriptionPaginator>(API_ENDPOINTS.SUBSCRIPTION, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
