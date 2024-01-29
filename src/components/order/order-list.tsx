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
      // title: t('table:table-item-tracking-number'),
      title: (
        <TitleWithSort
          title="Order Id"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'unique_id'
          }
          isActive={sortingObj.column === 'unique_id'}
        />
      ),
      dataIndex: 'unique_id',
      rowKey: 'unique_id',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('unique_id'),
    },
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
      width: 100,
      onHeaderCell: () => onHeaderClick('user_id'),
    },
    {
      // title: t('table:table-item-amount'),
      title: (
        <TitleWithSort
          title={t('table:table-item-amount')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'total'
          }
          isActive={sortingObj.column === 'total'}
        />
      ),
      dataIndex: 'total',
      rowKey: 'total',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('total'),
      render: function Render(value: any) {
        const prices = value ? value : 0;
        const { price } = usePrice({
          amount: Number(prices),
        });
        return <span>{price}</span>;
      },
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-total')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'total'
    //       }
    //       isActive={sortingObj.column === 'total'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'total',
    //   key: 'total',
    //   align: 'center',
    //   width: 120,
    //   onHeaderCell: () => onHeaderClick('total'),
    //   render: function Render(value: any) {
    //     const { price } = usePrice({
    //       amount: value,
    //     });
    //     return <span className="whitespace-nowrap">{price}</span>;
    //   },
    // },
    {
      // title: (
      //   <TitleWithSort
      //     title={t('table:table-item-order-date')}
      //     ascending={
      //       sortingObj.sort === SortOrder.Asc &&
      //       sortingObj.column === 'created_at'
      //     }
      //     isActive={sortingObj.column === 'created_at'}
      //   />
      // ),
      // title:t('table:table-item-order-date'),
      title: (
        <TitleWithSort
          title={t('table:table-item-order-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      rowKey: 'created_at',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs(date).format('DD/MM/YYYY')}
            {/* {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()} */}
          </span>
        );
      },
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-status')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
    //       }
    //       isActive={sortingObj.column === 'status'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'status',
    //   key: 'status',
    //   align: alignLeft,
    //   onHeaderCell: () => onHeaderClick('status'),
    //   render: (status: OrderStatus) => (
    //     <span
    //       className="whitespace-nowrap font-semibold"
    //       style={{ color: status?.color! }}
    //     >
    //       {status?.name}
    //     </span>
    //   ),
    // },
    // {
    //   title: t('table:table-item-shipping-address'),
    //   dataIndex: 'shipping_address',
    //   key: 'shipping_address',
    //   align: alignLeft,
    //   render: (shipping_address: UserAddress) => (
    //     <div>{formatAddress(shipping_address)}</div>
    //   ),
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: '_id',
      rowKey: 'actions',
      align: 'center',
      width: 100,
      render: (_id: string, order: Order) => {
        return (
          <ActionButtons
            id={_id}
            detailsUrl={`${router.asPath}/${_id}`}
            customLocale={order.language}
          />
        );
      },
    },
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
