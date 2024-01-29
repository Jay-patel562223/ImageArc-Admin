import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Price, MappedPaginatorInfo } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';

export type IProps = {
  prices: Price[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const PriceList = ({
  prices,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();

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
      // title: "Name",
      title: (
        <TitleWithSort
          title="Name"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      // align: 'center',
      align: alignLeft,
      width: 50,
      onHeaderCell: () => onHeaderClick('name'),
    },
    // {
    //   // title: "Name",
    //   title: (
    //     <TitleWithSort
    //       title="DPI"
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'dpi'
    //       }
    //       isActive={sortingObj.column === 'dpi'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'dpi',
    //   key: 'dpi',
    //   align: 'center',
    //   // align: alignLeft,
    //   width: 120,
    //   onHeaderCell: () => onHeaderClick('dpi'),
    //   render: (dpi: any) => {
    //     return <span  className="truncate whitespace-nowrap">{dpi?.name}</span>
    //   }
    // },
    {
      // title: "Price",
      title: (
        <TitleWithSort
          title="Price"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      // align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('price'),
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      rowKey: 'status',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: (type: any) => (
        <span  className="truncate whitespace-nowrap">{type.toUpperCase()}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'center',
      // align: alignRight,
      width: 120,
      render: (slug: string, record: Price) => {
        // checkDefault(record.name)
        const check = record.name != 'default' ? "DELETE_PRICE" :''
        return (<LanguageSwitcher
          slug={record._id}
          record={record}
          // deleteModalView="DELETE_PRICE"
          // deleteModalView={check}
          routes={Routes?.productPrice}
        />
      )},
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={prices}
          rowKey="_id"
          scroll={{ x: 100 }}
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

export default PriceList;
