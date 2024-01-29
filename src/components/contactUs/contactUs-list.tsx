import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import { SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { ContactUs, MappedPaginatorInfo } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import ActionButtons from '../common/action-buttons';

export type IProps = {
    contact: ContactUs[] | undefined;
    paginatorInfo: MappedPaginatorInfo | null;
    onPagination: (key: number) => void;
    onSort: (current: any) => void;
    onOrder: (current: string) => void;
};

const ContactUsList = ({
    contact,
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
        // {
        //   title: t('table:table-item-id'),
        //   dataIndex: 'id',
        //   key: 'id',
        //   align: 'center',
        //   width: 60,
        // },
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
            width: 200,
            onHeaderCell: () => onHeaderClick('name'),
        },
        {
            // title: "Name",
            title: (
                <TitleWithSort
                    title="Email"
                    ascending={
                        sortingObj.sort === SortOrder.Asc && sortingObj.column === 'email'
                    }
                    isActive={sortingObj.column === 'email'}
                />
            ),
            className: 'cursor-pointer',
            dataIndex: 'email',
            key: 'email',
            // align: 'center',
            align: alignLeft,
            width: 200,
            onHeaderCell: () => onHeaderClick('email'),
        },
        {
            // title: "Name",
            title: (
                <TitleWithSort
                    title="Subject"
                    ascending={
                        sortingObj.sort === SortOrder.Asc && sortingObj.column === 'subject'
                    }
                    isActive={sortingObj.column === 'subject'}
                />
            ),
            className: 'cursor-pointer',
            dataIndex: 'subject',
            key: 'subject',
            // align: 'center',
            align: alignLeft,
            width: 200,
            onHeaderCell: () => onHeaderClick('subject'),
        },
        {
            // title: "Name",
            title: (
                <TitleWithSort
                    title="Description"
                    ascending={
                        sortingObj.sort === SortOrder.Asc && sortingObj.column === 'description'
                    }
                    isActive={sortingObj.column === 'description'}
                />
            ),
            className: 'cursor-pointer',
            dataIndex: 'description',
            key: 'description',
            // align: 'center',
            align: alignLeft,
            width: 200,
            onHeaderCell: () => onHeaderClick('description'),
        },
        // {
        //   title: t('table:table-item-details'),
        //   dataIndex: 'details',
        //   key: 'details',
        //   ellipsis: true,
        //   align: alignLeft,
        //   width: 200,
        // },

        // {
        //   title: t('table:table-item-icon'),
        //   dataIndex: 'icon',
        //   key: 'icon',
        //   align: 'center',
        //   width: 120,
        //   render: (icon: string) => {
        //     if (!icon) return null;
        //     return (
        //       <span className="flex items-center justify-center">
        //         {getIcon({
        //           iconList: categoriesIcon,
        //           iconName: icon,
        //           className: 'w-5 h-5 max-h-full max-w-full',
        //         })}
        //       </span>
        //     );
        //   },
        // },
        // {
        //   title: t('table:table-item-slug'),
        //   dataIndex: 'slug',
        //   key: 'slug',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 150,
        //   render: (slug: any) => (
        //     <div
        //       className="overflow-hidden truncate whitespace-nowrap"
        //       title={slug}
        //     >
        //       {slug}
        //     </div>
        //   ),
        // },
        // {
        //   title: t('table:table-item-group'),
        //   dataIndex: 'type',
        //   key: 'type',
        //   align: 'center',
        //   width: 120,
        //   render: (type: any) => (
        //     <div
        //       className="overflow-hidden truncate whitespace-nowrap"
        //       title={type?.name}
        //     >
        //       {type?.name}
        //     </div>
        //   ),
        // },     
        {
            title: t('table:table-item-actions'),
            dataIndex: '_id',
            key: 'actions',
            align: 'center',
            // align: alignRight,
            width: 250,
            render: (_id: string, record: ContactUs) => (
                <>
                <LanguageSwitcher
                    key={record?._id}
                    slug={_id}
                    record={record}
                    deleteModalView="DELETE_CONTACTUS"
                    // routes={Routes?.contactUs}          
                />  
                </>
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
                    data={contact}
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

export default ContactUsList;
