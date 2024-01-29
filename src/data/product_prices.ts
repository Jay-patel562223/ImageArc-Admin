import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Price,
  PricePaginator,
  PriceQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { pricesClient } from './client/product_prices';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreatePriceMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(pricesClient.create, {
    onSuccess: () => {
      Router.push(Routes.productPrice.list, undefined, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_PRICE);
    },
  });
  return { mutate,  errorMessage, setErrorMessage };

};

export const useDeletePriceMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(pricesClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onError:(err)=>{
      // setErrorMessage(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_PRICE);
    },
  });
};



export const useUpdatePriceMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(pricesClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.productPrice.list);
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_PRICE);
    },
  });
    return { mutate,  errorMessage, setErrorMessage };
};

export const usePriceQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Price, Error>(
    [API_ENDPOINTS.PRODUCT_PRICE, { slug, language }],
    () => pricesClient.get({ slug, language })
  );

  return {
    prices: data,
    error,
    isLoading,
  };
};

export const usePricesQuery = (options: Partial<PriceQueryOptions>) => {
  const { data, error, isLoading } = useQuery<PricePaginator, Error>(
    [API_ENDPOINTS.PRODUCT_PRICE, options],
    ({ queryKey, priceParam }) =>
      pricesClient.paginated(Object.assign({}, queryKey[1], priceParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    prices: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
