import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { productClient } from './client/product';
import {
  ProductQueryOptions,
  GetParams,
  ProductPaginator,
  Product,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { useState } from 'react';

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const {mutate,isLoading} = useMutation(productClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.product.list}`
        : Routes.product.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
        // setTimeout(()=>{
          queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
        // },2000)
        // queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
    },
  });
  return { mutate,  errorMessage, setErrorMessage,isLoading };

};

export const useUpdateProductMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutate,isLoading} =  useMutation(productClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.product.list}`
        : Routes.product.list;
      // await router.push(`${generateRedirectUrl}/${data?._id}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      // setTimeout(async()=>{
        // window.location.href = Routes.product.list;
        await router.push(`${Routes.product.list}`, undefined, {
          locale: Config.defaultLanguage,
        });

      // },2000)
      toast.success(t('common:successfully-updated'));
    },
    onError:(err)=>{
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      // setTimeout(()=>{
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      // },1000)
    },
  });
  return { mutate,  errorMessage, setErrorMessage,isLoading };

};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(productClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    onError:(err)=>{
      toast.error(err?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
    },
  });
};


export const useApprovedPriceMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(productClient.changeStatus, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
    },
  });
};

export const useProductQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Product, Error>(
    [API_ENDPOINTS.PRODUCTS, { slug, language }],
    () => productClient.get({ slug, language })
  );

  return {
    product: data,
    error,
    isLoading,
  };
};

export const useProductsQuery = (
  params: Partial<ProductQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, params],
    ({ queryKey, pageParam }) =>
      productClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    products: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
