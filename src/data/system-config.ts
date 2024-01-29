import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
    SystemConfig,
    SystemConfigQueryOptions,
    SystemConfigPaginator,
    GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { useState } from 'react';
import { systemConfigClient } from './client/systemConfig';



export const useCreateSystemConfigMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate } = useMutation(systemConfigClient.create, {
        onSuccess: (data) => {
            Router.push(Routes?.systemConfig?.list, undefined, {
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
            queryClient.invalidateQueries(API_ENDPOINTS?.SOCIAL_MEDIA);
        },
    });
    return { mutate, errorMessage, setErrorMessage };
};


export const useDeleteSystemConfigMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(systemConfigClient.delete, {
        onSuccess: (data) => {
            toast.success(t('common:successfully-deleted'));
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message);

        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS?.SOCIAL_MEDIA);
        },
    });
};

export const useUpdateSystemConfigMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate } = useMutation(systemConfigClient.update, {
        onSuccess: (data) => {
            toast.success(t('common:successfully-updated'));
            Router.push(Routes?.systemConfig?.list);
        },
        onError: (err) => {
            setErrorMessage(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS?.SOCIAL_MEDIA);
        },
    });
    return { mutate, errorMessage, setErrorMessage };
};



export const useSystemConfigQuery = ({ slug, language }: GetParams) => {
    const { data, error, isLoading } = useQuery<SystemConfig, Error>(
        [API_ENDPOINTS?.SOCIAL_MEDIA, { slug, language }],
        () => systemConfigClient.get({ slug, language })
    );

    return {
        systemConfig: data,
        error,
        isLoading,
    };
};


export const useSystemsConfigQuery = (options: Partial<SystemConfigQueryOptions>) => {
    const { data, error, isLoading } = useQuery<SystemConfigPaginator, Error>(
        [API_ENDPOINTS?.SOCIAL_MEDIA, options],
        ({ queryKey, pageParam }) =>
            systemConfigClient.paginated(Object.assign({}, queryKey[1], pageParam)),
        {
            keepPreviousData: true,
        }
    );

    return {
        systemConfig: data?.data ?? [],
        paginatorInfo: mapPaginatorData(data),
        error,
        loading: isLoading,
    };
};
