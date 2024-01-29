import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  PackageType,
  PackageTypePaginator,
  PackageTypeQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { packageTypeClient } from './client/package-type';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreatePackageTypeMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate,isLoading} = useMutation(packageTypeClient.create, {
    onSuccess: () => {
      Router.push(Routes.package_type.list, undefined, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.PACKAGETYPE);
    },
  });
 
  return { mutate, isLoading, errorMessage, setErrorMessage };
};

export const useDeletePackageTypeMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(packageTypeClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onError:(err)=>{
      // setErrorMessage(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PACKAGETYPE);
    },
  });
};

export const useUpdatePackageTypeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate,isLoading} = useMutation(packageTypeClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.package_type.list);
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PACKAGETYPE);
    },
  });
  
  return { mutate, isLoading, errorMessage, setErrorMessage };
};

export const usePackageTypeQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<PackageType, Error>(
    [API_ENDPOINTS.PACKAGETYPE, { slug, language }],
    () => packageTypeClient.get({ slug, language })
  );

  return {
    packageType: data,
    error,
    isLoading,
  };
};

export const usePackageTypesQuery = (options: Partial<PackageTypeQueryOptions>) => {
  const { data, error, isLoading } = useQuery<PackageTypePaginator, Error>(
    [API_ENDPOINTS.PACKAGETYPE, options],
    ({ queryKey, pageParam }) =>
      packageTypeClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    packageType: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useGetAllProductPrice = () => {
  const { data, error, isLoading } = useQuery<PackageType, Error>(
    [API_ENDPOINTS.GetAllProductPrice],
    () => packageTypeClient.getNew(API_ENDPOINTS.GetAllProductPrice)
  );

  return {
    fileType: data?.data,
    error,
    isLoading,
  };
};

