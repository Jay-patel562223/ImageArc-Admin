import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { OrderStatus, SortOrder, UserAddress } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Order, MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';

type IProps = {
  orders: Order[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const OrderList = ({
  orders,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = orders! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });


  const columns = [
    {
      // title: t('table:table-item-user'),
      title: (
        <TitleWithSort
          title={t('table:table-item-user')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'user_id'
          }
          isActive={sortingObj.column === 'user_id'}
        />
      ),
      dataIndex: 'user',
      rowKey: 'user',
      align: 'center',
      onHeaderCell: () => onHeaderClick('user_id'),
      // width: 100,
    },
    {
      // title: 'Charge Id',
      title: (
        <TitleWithSort
          title="Order Id"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'unique_order_id'
          }
          isActive={sortingObj.column === 'unique_order_id'}
        />
      ),
      dataIndex: 'unique_order_id',
      key: 'unique_order_id',
      align: alignLeft,
      // width: 120,
      onHeaderCell: () => onHeaderClick('unique_order_id'),
      render: function Render(_: any, record: any) {
        return record.unique_order_id;
      },
    },
    {
      // title: 'Charge Id',
      title: (
        <TitleWithSort
          title="Charge Id"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'payment_intent_id'
          }
          isActive={sortingObj.column === 'payment_intent_id'}
        />
      ),
      dataIndex: 'payment_intent_id',
      key: 'payment_intent_id',
      align: alignLeft,
      // width: 120,
      onHeaderCell: () => onHeaderClick('payment_intent_id'),
      // render: function Render(_: any, record: any) {
      //   if(record.payment_gateway === "STRIPE"){
      //     return record.charge_id != undefined  ? record.charge_id : record.payment_intent_id;
      //   } else {
      //     return record.razorpay_id;
      //   }
      // },
    },
    {
      // title: 'Amount',
      title: (
        <TitleWithSort
          title="Amount"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'amount'
          }
          isActive={sortingObj.column === 'amount'}
        />
      ),
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      // width: 100,
      onHeaderCell: () => onHeaderClick('amount'),
      render: function RenderAmount(amount: any) {
        const { price } = usePrice({
          amount: Number(amount) ?? 0,
        });
        return <p>{price}</p>;
      },
    },
    {
      // title: 'Type',
      title: (
        <TitleWithSort
          title="Type"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'pay_type'
          }
          isActive={sortingObj.column === 'pay_type'}
        />
      ),
      dataIndex: 'pay_type',
      key: 'pay_type',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('pay_type'),
      // width: 120,
    },
    {
      // title: 'Payment Gateway',
      title: (
        <TitleWithSort
          title="Payment Gateway"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'payment_gateway'
          }
          isActive={sortingObj.column === 'payment_gateway'}
        />
      ),
      dataIndex: 'payment_gateway',
      key: 'payment_gateway',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('payment_gateway'),
    },
    {
      // title: 'Card',
      title: (
        <TitleWithSort
          title="Card"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'last4'
          }
          isActive={sortingObj.column === 'last4'}
        />
      ),
      dataIndex: 'last4',
      key: 'last4',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('last4'),
      // width: 100,
    },
    {
      // title: 'Status',
      title: (
        <TitleWithSort
          title="Status"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
          }
          isActive={sortingObj.column === 'status'}
        />
      ),
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      // width: 100,
      onHeaderCell: () => onHeaderClick('status'),
      render: function RenderStatus(status: any) {

        return <p>{status.toUpperCase()}</p>;
      },
    },
    {
      // title: 'Order Date',
      title: (
        <TitleWithSort
          title="Order Date"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      align: alignLeft,
      width: 100,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: function RenderCreatedAt(created_at: any) {

        return <p>{dayjs(created_at).format('DD/MM/YYYY')}</p>;
        // return <p>{dayjs(created_at).format('MMMM D, YYYY')}</p>;
      },
    },
    // {
    //   title: t('table:table-item-actions'),
    //   dataIndex: '_id',
    //   key: 'actions',
    //   align: 'center',
    //   width: 100,
    //   render: (_id: string, order: Order) => {
    //     return (
    //       <ActionButtons
    //         id={_id}
    //         detailsUrl={`${router.asPath}/${_id}`}
    //         customLocale={order.language}
    //       />
    //     );
    //   },
    // },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={orders}
          rowKey="_id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderList;
