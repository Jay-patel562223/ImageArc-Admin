import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { mapPaginatorData } from '@/utils/data-mappers';
import {
  TransactionQueryOptions,
  TransactionPaginator,
  Transaction,
  InvoiceTranslatedText,
} from '@/types';
import { transactionClient } from './client/transaction';
import { exportClient } from '@/data/client/export';

export const useTransactionsQuery = (
  params: Partial<TransactionQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<TransactionPaginator, Error>(
    [API_ENDPOINTS.TRANSACTION, params],
    ({ queryKey, pageParam }) =>
    transactionClient.TRANSACTION(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );
  return {
    orders: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useTransactionQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Transaction, Error>(
    [API_ENDPOINTS.TRANSACTION, { id, language }],
    () => transactionClient.get({ id, language })
  );

  return {
    order: data,
    error,
    isLoading,
  };
};

export const useCreateTransactionMutation = () => {
  return useMutation(transactionClient.create);
};

export const useUpdateTransactionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(transactionClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
    },
  });
};

export const useDownloadInvoiceMutation = (
  { order_id, isRTL, language }: { order_id: string, isRTL: boolean, language: string },
  options: any = {}
) => {
  const { t } = useTranslation();
  const formattedInput = {
    order_id,
    is_rtl: isRTL,
    language,
    translated_text: {
      subtotal: t('order-sub-total'),
      discount: t('order-discount'),
      tax: t('order-tax'),
      delivery_fee: t('order-delivery-fee'),
      total: t('order-total'),
      products: t('text-products'),
      quantity: t('text-quantity'),
      invoice_no: t('text-invoice-no'),
      date: t('text-date'),
    },
  };

  return useQuery<string, Error>(
    [API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD],
    () => transactionClient.downloadInvoice(formattedInput),
    {
      ...options,
    }
  );
};
