import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { siteSettings } from '@/settings/site.settings';
import {
  Users,
  MappedPaginatorInfo,
  SortOrder,
  User,
  UserPaginator,
} from '@/types';
import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { Routes } from '@/config/routes';

type IProps = {
  customers: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CustomerList = ({
  customers,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );

      onOrder(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    // {
    //   title: t('table:table-item-avatar'),
    //   dataIndex: 'profile',
    //   key: 'profile',
    //   align: 'center',
    //   width: 74,
    //   render: (profile: any, record: any) => (
    //     <Image
    //       src={profile?.avatar?.thumbnail ?? siteSettings.avatar.placeholder}
    //       alt={record?.name}
    //       layout="fixed"
    //       width={42}
    //       height={42}
    //       className="overflow-hidden rounded"
    //     />
    //   ),
    // },
    {
      // title: t('table:table-item-title'),
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'first_name'
          }
          isActive={sortingObj.column === 'first_name'}
        />
      ),
      dataIndex: 'first_name',
      key: 'name',
      align: 'center',
      // align: alignLeft,
      width: 200,
      onHeaderCell: () => onHeaderClick('first_name'),
    },
    {
      // title: t('table:table-item-email'),
      title: (
        <TitleWithSort
          title={t('table:table-item-email')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'email'
          }
          isActive={sortingObj.column === 'email'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      // align: alignLeft,
      width: 200,
      onHeaderCell: () => onHeaderClick('email'),
    },
    // {
    //   title: t('table:table-item-permissions'),
    //   dataIndex: 'permissions',
    //   key: 'permissions',
    //   align: 'center',
    //   render: (permissions: any, record: any) => {
    //     return (
    //       <div>
    //         {permissions?.map(({ name }: { name: string }) => name).join(', ')}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: t('table:table-item-available_wallet_points'),
    //   dataIndex: ['wallet', 'available_points'],
    //   key: 'available_wallet_points',
    //   align: 'center',
    // },
    {
      // title: "Status",
      title: (
        <TitleWithSort
          title="Status"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
          }
          isActive={sortingObj.column === 'status'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 200,
      onHeaderCell: () => onHeaderClick('status'),
      render: (status: String) => (status == 'active' ? 'Active' : 'Inactive'),
    },
    {
      title: t('table:table-item-change-status'),
      dataIndex: 'id',
      rowKey: 'actions',
      // align: 'right',
      align: 'center',
      width: 120,
      render: function Render(_id: string,record: User) {
        return (
          <>
              <ActionButtons
                key={record?._id}
                id={record?._id}
                // approveProduct={true}
                userStatus={record?.status}
                // isApproved={record?.product_status == 'approved' }
                isUserActive={record?.status == 'active' ? true : false }
                // showAddWalletPoints={true}
                // showMakeAdminButton={true}
              />
          </>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      // align: 'right',
      align: 'center',
      width: 200,
      render: (_id: string, record: Users) => {
          return (
            <>
              <LanguageSwitcher
                slug={record?._id}
                record={record}
                deleteModalView="DELETE_USER"
                routes={Routes?.user}
              />
            </>
          )
      }
       
      ,
      // render: function Render(id: string, { is_active }: any) {
      //   const { data } = useMeQuery();
      //   return (
      //     <>
      //       {data?._id != id && (
      //         <ActionButtons
      //           id={id}
      //           userStatus={true}
      //           // isUserActive={is_active}
      //           // showAddWalletPoints={true}
      //           // showMakeAdminButton={true}
      //         />
      //       )}
      //     </>
      //   );
      // },
    },
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={customers}
          rowKey="_id"
          scroll={{ x: 800 }}
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

export default CustomerList;
