import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Country,
  CountryPaginator,
  CountryQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { countryClient } from './client/country';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreateCountryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(countryClient.create, {
    onSuccess: () => {
      Router.push(Routes.countries.list, undefined, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.COUNTRIES);
    },
  });
  return { mutate,  errorMessage, setErrorMessage };

};

export const useDeleteCountryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(countryClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onError:(err)=>{
      toast.error(err?.response?.data?.message);
      // setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUNTRIES);
    },
  });
};

export const useUpdateCountryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(countryClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.countries.list);
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUNTRIES);
    },
  });
    return { mutate,  errorMessage, setErrorMessage };
};

export const useCountryQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Country, Error>(
    [API_ENDPOINTS.COUNTRIES, { slug, language }],
    () => countryClient.get({ slug, language })
  );

  return {
    countries: data,
    error,
    isLoading,
  };
};

export const useCountrysQuery = (options: Partial<CountryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CountryPaginator, Error>(
    [API_ENDPOINTS.COUNTRIES, options],
    ({ queryKey, priceParam }) =>
      countryClient.paginated(Object.assign({}, queryKey[1], priceParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    countries: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
