import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { SortOrder, SystemConfig, } from '@/types';
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
    systemConfig: SystemConfig[] | undefined;
    paginatorInfo: MappedPaginatorInfo | null;
    onPagination: (key: number) => void;
    onSort: (current: any) => void;
    onOrder: (current: string) => void;
};
const SystemConfigList = ({
    systemConfig,
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
            title: t('table:table-item-image'),
            dataIndex: 'image',
            key: 'image',
            align: 'center',
            width: 110,
            render: (image: any, { name }: { name: string }) => {
              if (!image) return null;
              return (
                <Image
                  src={image ?? '/'}
                  alt={name}
                  layout="fixed"
                  width={40}
                  height={40}
                //   className="overflow-hidden rounded"
                />
              );
            },
          },
        {
            // title: "Country",
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
            // align: alignLeft,
            align: 'center',
            width: 50,
            onHeaderCell: () => onHeaderClick('name'),
            render: (name: string) => (
                <span  className="truncate whitespace-nowrap capitalize">{name}</span>
              ),
        },
        {
            // title: "Country",
            title: (
                <TitleWithSort
                    title="Social Media Url"
                    ascending={
                        sortingObj.sort === SortOrder.Asc && sortingObj.column === 'url'
                    }
                    isActive={sortingObj.column === 'url'}
                />
            ),
            className: 'cursor-pointer',
            dataIndex: 'url',
            key: 'url',
            // align: alignLeft,
            align: 'center',
            width: 50,
            onHeaderCell: () => onHeaderClick('url'),
        },
        {
            // title: "Country",
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
            // align: alignLeft,
            align: 'center',
            width: 50,
            onHeaderCell: () => onHeaderClick('status'),
          
        },
        {
            title: t('table:table-item-actions'),
            dataIndex: 'slug',
            key: 'actions',
            // align: alignRight,
            align: 'center',
            width: 120,
            render: (slug: string, record: SystemConfig) => {
                return (
                    <>
                        {/* <StateForm/> */}
                        <LanguageSwitcher
                            slug={record._id}
                            record={record}
                            deleteModalView="DELETE_SYSTEM_CONFIG"
                            routes={Routes?.systemConfig}
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
                    data={systemConfig}
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

export default SystemConfigList;
