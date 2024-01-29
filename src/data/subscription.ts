import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Subscription,
  SubscriptionPaginator,
  SubscriptionQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { subscriptionClient } from './client/subscription';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate,isLoading} = useMutation(subscriptionClient.create, {
    onSuccess: () => {
      Router.push(Routes.subscription.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBSCRIPTION);
    },
  });
 
  return { mutate, isLoading, errorMessage, setErrorMessage };
};

export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(subscriptionClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBSCRIPTION);
    },
  });
};

export const useUpdateSubscriptionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate,isLoading} = useMutation(subscriptionClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.subscription.list);
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBSCRIPTION);
    },
  });
  
  return { mutate, isLoading, errorMessage, setErrorMessage };
};

export const useSubscriptionQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Subscription, Error>(
    [API_ENDPOINTS.SUBSCRIPTION, { slug, language }],
    () => subscriptionClient.get({ slug, language })
  );

  return {
    subscription: data,
    error,
    isLoading,
  };
};

export const useSubscriptionsQuery = (options: Partial<SubscriptionQueryOptions>) => {
  const { data, error, isLoading } = useQuery<SubscriptionPaginator, Error>(
    [API_ENDPOINTS.SUBSCRIPTION, options],
    ({ queryKey, pageParam }) =>
      subscriptionClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    subscription: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
