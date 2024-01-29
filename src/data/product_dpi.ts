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
import { dpiClient } from './client/product_dpi';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreateDpiMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(dpiClient.create, {
    onSuccess: () => {
      Router.push(Routes.product_dpi.list, undefined, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_DPI);
    },
  });
  return { mutate,  errorMessage, setErrorMessage };

};

export const useDeleteDpiMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(dpiClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_DPI);
    },
  });
};



export const useUpdateDpiMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate} =  useMutation(dpiClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.product_dpi.list);
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_DPI);
    },
  });
    return { mutate,  errorMessage, setErrorMessage };
};

export const useDpiQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Price, Error>(
    [API_ENDPOINTS.PRODUCT_DPI, { slug, language }],
    () => dpiClient.get({ slug, language })
  );

  return {
    prices: data,
    error,
    isLoading,
  };
};

export const useDpisQuery = (options: Partial<PriceQueryOptions>) => {
  const { data, error, isLoading } = useQuery<PricePaginator, Error>(
    [API_ENDPOINTS.PRODUCT_DPI, options],
    ({ queryKey, priceParam }) =>
      dpiClient.paginated(Object.assign({}, queryKey[1], priceParam)),
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


export const useGetAllProductDpi = () => {
  const { data, error, isLoading } = useQuery<Price, Error>(
    [API_ENDPOINTS.GetAllProductDpi],
    () => dpiClient.getNew(API_ENDPOINTS.GetAllProductDpi)
  );

  return {
    dpis: data?.data,
    error,
    isLoading,
  };
};
