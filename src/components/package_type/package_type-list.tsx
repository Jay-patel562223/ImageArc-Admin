import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { PackageType, SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Country, MappedPaginatorInfo } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  packageType: PackageType[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const PackageTypeList = ({
  packageType,
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
        currentSortDirection === SortOrder?.Desc ? SortOrder?.Asc : SortOrder?.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder?.Desc ? SortOrder?.Asc : SortOrder?.Desc,
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
            sortingObj.sort == SortOrder.Desc && sortingObj.column == 'name'
          }
          isActive={sortingObj.column == 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      // align: alignLeft,
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('name'),
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
      width: 120,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('status'),
      render: (type: any) => (<span className="truncate whitespace-nowrap">{type.toUpperCase()}</span>),
    },
    // {
    //   title: t('table:table-item-add-state'),
    //   dataIndex: 'id',
    //   rowKey: 'actions',
    //   align: 'right',
    //   width: 200,
    //   render: function Render(_id: string,record: Country) {
    //     return (
    //       <>
    //           <ActionButtons
    //             key={record?._id}
    //             id={record?._id}
    //             // approveProduct={true}
    //             isStateAdd={true}
    //             // userStatus={true}
    //             // isApproved={record?.product_status == 'approved' }
    //             // showAddWalletPoints={true}
    //             // showMakeAdminButton={true}
    //           />
    //       </>
    //     );
    //   },
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      // align: alignRight,
      align: 'center',
      width: 200,
      render: (slug: string, record: Country) => {
        return (
          <>
            {/* <StateForm/> */}
            <LanguageSwitcher
              slug={record._id}
              record={record}
              deleteModalView="DELETE_PACKAGE_TYPE"
              routes={Routes?.package_type}
            />
          </>
        )
      }
    },
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={packageType}
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

export default PackageTypeList;
