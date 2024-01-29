import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  State,
  StatePaginator,
  StateQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { stateClient } from './client/state';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreateStateMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(stateClient.create, {
    onSuccess: () => {
      Router.push(Routes.states.list, undefined, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.STATES);
    },
  });
  return { mutate,  errorMessage, setErrorMessage };

};

export const useDeleteStateMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(stateClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STATES);
    },
  });
};



export const useUpdateStateMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(stateClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.states.list);
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STATES);
    },
  });
    return { mutate,  errorMessage, setErrorMessage };
};

export const useStateQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<State, Error>(
    [API_ENDPOINTS.STATES, { slug, language }],
    () => stateClient.get({ slug, language })
  );

  return {
    states: data,
    error,
    isLoading,
  };
};

export const useStateCountryQuery = ({ slug, language }: GetParams) => {
  // const { data, error, isLoading } = useQuery(
  //   [API_ENDPOINTS.STATES_COUNTRY, { slug, language }],
  //   () => stateClient.get({ slug, language })
  // );

  // return {
  //   states: data,
  //   error,
  //   isLoading,
  // };
  const { data, error, isLoading } = useQuery<StatePaginator, Error>(
    [API_ENDPOINTS.STATES_COUNTRY],
    ({ queryKey }) =>
      stateClient.paginated(Object.assign({}, queryKey[1])),
    {
      keepPreviousData: true,
    }
  );

  return {
    states: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};



export const useStatesQuery = (options: Partial<StateQueryOptions>) => {
  const { data, error, isLoading } = useQuery<StatePaginator, Error>(
    [API_ENDPOINTS.STATES, options],
    ({ queryKey, priceParam }) =>
      stateClient.paginated(Object.assign({}, queryKey[1], priceParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    states: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
