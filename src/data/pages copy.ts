import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Page,
  PagePaginator,
  PageQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { pagesClient } from './client/pages';
import { Config } from '@/config';

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(pagesClient.create, {
    onSuccess: () => {
      Router.push(Routes.pages.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError:(err)=>{
      toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PAGES);
    },
  });
};

export const useDeletePageMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(pagesClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PAGES);
    },
  });
};

export const useUpdatePageMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(pagesClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
      Router.push(Routes.pages.list);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PAGES);
    },
  });
};

export const usePageQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Page, Error>(
    [API_ENDPOINTS.PAGES, { slug, language }],
    () => pagesClient.get({ slug, language })
  );

  return {
    pages: data,
    error,
    isLoading,
  };
};

export const usePagesQuery = (options: Partial<PageQueryOptions>) => {
  const { data, error, isLoading } = useQuery<PagePaginator, Error>(
    [API_ENDPOINTS.PAGES, options],
    ({ queryKey, pageParam }) =>
      pagesClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    pages: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
