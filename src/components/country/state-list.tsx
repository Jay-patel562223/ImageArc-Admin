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
import { State, MappedPaginatorInfo } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  states: State[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const StateList = ({
  states,
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

  const capitalizeFLetter =(state:string) =>{
    return state.charAt(0).toUpperCase() +
    state.slice(1)     
  }

  const columns = [
    {
      // title: "State",
      title: (
        <TitleWithSort
          title="State"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'states'
          }
          isActive={sortingObj.column === 'states'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'states',
      key: 'states',
      // align: alignLeft,
      align: 'center',
      width: 200,
      onHeaderCell: () => onHeaderClick('states',),
      render: function RenderStatus(states: string) {
        return <p>{capitalizeFLetter(states) }</p>;
      },
    },
    {
      // title: "Country",
      title: (
        <TitleWithSort
          title="Country"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'country_id'
          }
          isActive={sortingObj.column === 'country_id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'country',
      key: 'country',
      align: 'center',
      // align: alignLeft,
      width: 200,
      onHeaderCell: () => onHeaderClick('country_id'),
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
      render: (type: any) => (
        <span className="truncate whitespace-nowrap">{type.toUpperCase()}</span>
      ),
    },
    // {
    //   title: t('table:table-item-add-state'),
    //   dataIndex: 'id',
    //   rowKey: 'actions',
    //   align: 'right',
    //   width: 200,
    //   render: function Render(_id: string,record: State) {
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
      align: 'center',
      // align: alignRight,
      width: 200,
      render: (slug: string, record: State) => {
        return (
          <>
            {/* <StateForm/> */}
            <LanguageSwitcher
              slug={record._id}
              record={record}
              deleteModalView="DELETE_STATE"
              routes={Routes?.states}
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
          data={states}
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

export default StateList;
