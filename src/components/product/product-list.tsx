import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import Badge from '@/components/ui/badge/badge';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  Product,
  MappedPaginatorInfo,
  ProductType,
  Shop,
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { useMeQuery } from '@/data/user';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  products: Product[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const ProductList = ({
  products,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = products! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
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

  let columns = [
    {
      title: t('table:table-item-image'),
      dataIndex: 'image',
      rowKey: 'image',
      align: 'center',
      // align: alignLeft,
      width: 120,
      render: (image: any, { name }: { name: string }) => {

        return (
          <>

            <Image
              src={image}
              alt={name}
              layout="fixed"
              width={42}
              height={42}
              className="overflow-hidden rounded"
            />
          </>
          // <img 
          // src={image ?? siteSettings.product.placeholder} 
          // alt={name}
          // width={42}
          // height={42}
          // // className="overflow-hidden rounded"
          // />
        )
      },
    },
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
      rowKey: 'name',
      align: 'center',
      // align: alignLeft,
      width: 120,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
    },
    // {
    //   // title: t('table:table-item-status'),
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-status')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'product_status'
    //       }
    //       isActive={sortingObj.column === 'product_status'}
    //     />
    //   ),
    //   dataIndex: 'product_status',
    //   rowKey: 'product_status',
    //   width: 120,
    //   align: 'center',
    //   ellipsis: true,
    //   onHeaderCell: () => onHeaderClick('product_status'),
    //   render: (type: any) => (
    //     <span  className="truncate whitespace-nowrap">{type.toUpperCase()}</span>
    //   ),
    // },
    {
      title: t('table:table-item-change-status'),
      dataIndex: 'id',
      rowKey: 'actions',
      align: 'center',
      // align: 'right',
      width: 120,
      render: function Render(_id: string, record: Product) {
        return (
          <>
            <ActionButtons
              key={record?._id}
              id={record?._id}
              approveProduct={true}
              // userStatus={true}
              isApproved={record?.product_status == 'approved'}
            // showAddWalletPoints={true}
            // showMakeAdminButton={true}
            />
          </>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      rowKey: '_id',
      align: 'center',
      // align: 'right',
      width: 120,
      render: (slug: string, record: Product) => (
        <LanguageSwitcher
          key={record?._id}
          slug={record._id}
          record={record}
          deleteModalView="DELETE_PRODUCT"
          routes={Routes?.product}
        />
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          /* @ts-ignore */
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={products}
          rowKey="_id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
