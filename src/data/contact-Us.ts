import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
    ContactUs,
    GetParams,
    ContactUsQueryOptions,
    ContactUsPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { useState } from 'react';
import { contactUsClient } from './client/contactUs';

export const useCreateContactUsMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate } = useMutation(contactUsClient.create, {
        onSuccess: () => {
            Router.push(Routes.contactUs.list, undefined, {
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
            queryClient.invalidateQueries(API_ENDPOINTS.CONTACTUS);
        },
    });
    return { mutate, errorMessage, setErrorMessage };
};


export const useDeleteContactUsMutation = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(contactUsClient.delete, {
        onSuccess: () => {
            toast.success(t('common:successfully-deleted'));
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message);
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.CONTACTUS);
            console.log("queryClient",queryClient);
        },
    });
};


export const useContactUsQuery = ({ slug, language }: GetParams) => {
    const { data, error, isLoading } = useQuery<ContactUs, Error>(
        [API_ENDPOINTS.CONTACTUS, { slug, language }],
        () => contactUsClient.get({ slug, language })
    );

    return {
        contactUs: data,
        error,
        isLoading,
    };
};

export const useContactsUsQuery = (options: Partial<ContactUsQueryOptions>) => {
    const { data, error, isLoading } = useQuery<ContactUsPaginator, Error>(
        [API_ENDPOINTS.CONTACTUS, options],
        ({ queryKey, pageParam }) =>
            contactUsClient.paginated(Object.assign({}, queryKey[1], pageParam)),
        {
            keepPreviousData: true,
        }
    );

    return {
        contactUs: data?.data ?? [],
        paginatorInfo: mapPaginatorData(data),
        error,
        loading: isLoading,
    };
};
