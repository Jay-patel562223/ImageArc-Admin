import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { categoryClient } from './client/category';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate } = useMutation(categoryClient.create, {
    onSuccess: () => {
      Router.push(Routes.category.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError: (err) => {
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
  return { mutate, errorMessage, setErrorMessage };
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(categoryClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate } = useMutation(categoryClient.update, {
    onSuccess: (data) => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.category.list);
    },
    onError: (err) => {
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
  return { mutate, errorMessage, setErrorMessage };
};

export const useCategoryQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Category, Error>(
    [API_ENDPOINTS.CATEGORIES, { slug, language }],
    () => categoryClient.get({ slug, language })
  );

  return {
    category: data,
    error,
    isLoading,
  };
};

export const useCategoriesQuery = (options: Partial<CategoryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES, options],
    ({ queryKey, pageParam }) =>
      categoryClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    categories: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useActiveCategoriesQuery = (options: Partial<CategoryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.ACTIVECATEGORIES, options],
    ({ queryKey, pageParam }) =>
      categoryClient.paginatedActive(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    categories: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
