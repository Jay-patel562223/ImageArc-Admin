import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Page, MappedPaginatorInfo } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';

export type IProps = {
  categories: Page[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const PageList = ({
  pages,
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

  // const columns = [
  //   {
  //     title: (
  //       <TitleWithSort
  //         title={t('table:table-item-title')}
  //         ascending={
  //           sortingObj.sort === SortOrder.Asc && sortingObj.column === 'title'
  //         }
  //         isActive={sortingObj.column === 'title'}
  //       />
  //     ),
  //     className: 'cursor-pointer',
  //     dataIndex: 'title',
  //     key: 'title',
  //     align: alignLeft,
  //     width: 200,
  //     onHeaderCell: () => onHeaderClick('title'),
  //   },
  //   {
  //     title: (
  //       <TitleWithSort
  //         title={t('table:table-item-slug')}
  //         ascending={
  //           sortingObj.sort === SortOrder.Asc && sortingObj.column === 'slug'
  //         }
  //         isActive={sortingObj.column === 'slug'}
  //       />
  //     ),
  //     className: 'cursor-pointer',
  //     dataIndex: 'slug',
  //     key: 'slug',
  //     align: alignLeft,
  //     width: 200,
  //     onHeaderCell: () => onHeaderClick('slug'),
  //   },
   
  //   {
  //     title: t('table:table-item-actions'),
  //     dataIndex: 'slug',
  //     key: 'actions',
  //     align: alignRight,
  //     width: 250,
  //     render: (slug: string, record: Page) => (
  //       <LanguageSwitcher
  //         slug={slug}
  //         record={record}
  //         deleteModalView="DELETE_PAGE"
  //         routes={Routes?.pages}
  //       />
  //     ),
  //   },
  // ];
  const columns = [
    {
      // title: 'Title',
      title: (
        <TitleWithSort
          title="Title"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'title'
          }
          isActive={sortingObj.column === 'title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      // align: alignLeft,
      align: 'center',
      width: 200,
      onHeaderCell: () => onHeaderClick('title'),
    },
    {
      title: "Slug",
      className: 'cursor-pointer',
      dataIndex: 'slug',
      key: 'slug',
      // align: alignLeft,
      align: 'center',
      width: 200,
    },
    {
      // title: t('table:table-item-status'),
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
          }
          isActive={sortingObj.column === 'status'}
        />
      ),
      dataIndex: 'status',
      rowKey: 'status',
      width: 200,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('status'),
      render: (type: any) => (
        <span  className="truncate whitespace-nowrap">{type.toUpperCase()}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      // align: alignRight,
      align: 'center',
      width: 200,
      render: (slug: string, record: Page) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_PAGE"
          routes={Routes?.pages}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={pages}
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
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default PageList;
