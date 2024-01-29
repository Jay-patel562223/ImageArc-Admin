import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { Subscription, SortOrder, MappedPaginatorInfo, Country } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import ActionButtons from '../common/action-buttons';
import DataTable from 'react-data-table-component';


export type IProps = {
  subscription: Subscription[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const SubscriptionList = ({
  subscription,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  // const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();

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
      name: 'Package Type',
      sortable: true,
      selector: row => row.package_data.name,
      style: {
        textTransform: "capitalize",
        fontSize: "14px",
        color: "rgb(107, 114, 128)",

      },
    },
    {
      name: 'File Type',
      sortable: true,
      selector: row => row?.file_type_data?.name,
      style: {
        fontSize: "14px",
        color: "rgb(107, 114, 128)",
      },
    },
    {
      name: 'Quantity',
      sortable: true,
      selector: row => row?.qnty,
      style: {
        fontSize: "14px",
        color: "rgb(107, 114, 128)",
      },
    },
    {
      name: 'Price',
      sortable: true,
      selector: row => row?.price,
      style: {
        fontSize: "14px",
        color: "rgb(107, 114, 128)",
      },
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => row?.status,
      style: {
        textTransform: "capitalize",
        fontSize: "14px",
        color: "rgb(107, 114, 128)",
      },
    },
    {
      name: 'Actions',
      selector: row => <LanguageSwitcher
        slug={row?._id}
        record={row}
        deleteModalView="DELETE_SUBSCRIPTION"
        routes={Routes?.subscription}
      />
      // sortable: true,
      // format:(row, cell) =>(
      //   <>
      //     {console.log("row", row)}
      //   </>
      // )
      // routes={Routes?.subscription}
    },

    // {
    //   title: "Price",
    //   className: 'cursor-pointer',
    //   dataIndex: 'price',
    //   key: 'price',
    //   align: alignLeft,
    //   width: 200,
    //   onHeaderCell: () => onHeaderClick('price'),
    // },
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
    // {
    //   title: t('table:table-item-actions'),
    //   dataIndex: 'slug',
    //   key: 'actions',
    //   // align: alignRight,
    //   align: 'center',
    //   width: 200,
    //   render: (slug: string, record: Country) => {
    //     return (
    //       <>
    //         {/* <StateForm/> */}
    //         <LanguageSwitcher
    //           slug={record?._id}
    //           record={record}
    //           deleteModalView="DELETE_SUBSCRIPTION"
    //           routes={Routes?.subscription}
    //         />
    //       </>
    //     )
    //   }
    // },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        {/* <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={subscription}
          rowKey="_id"
          scroll={{ x: 800 }}
          // expandable={{
          //   expandedRowRender: () => '',
          //   rowExpandable: rowExpandable,
          // }}
        /> */}
        <DataTable columns={columns} data={subscription} rowKey="_id" className='table-borderless' highlightOnHover  />
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

export default SubscriptionList;
