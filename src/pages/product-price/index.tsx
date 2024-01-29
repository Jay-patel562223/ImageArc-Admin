import PriceList from '@/components/product_price/product-price-list';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import TypeFilter from '@/components/category/type-filter';
import { adminOnly } from '@/utils/auth-utils';
import { usePricesQuery } from '@/data/product_prices';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { PAGELIMIT } from '@/utils/constants';

export default function ProductPrice() {
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { prices, paginatorInfo, loading, error } = usePricesQuery({
    limit: PAGELIMIT,
    // prices,
    page,
    type,
    name: searchTerm,
    orderBy,
    sortedBy,
    parent: null,
    language: locale,
  });

  // useEffect(()=>{

  // },[prices])

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      {/* <Card className="mb-4 md:mb-0 md:w-4/4" style={{float:'right'}}> */}
      
      {/* </Card> */}

      <Card className="mb-8 flex flex-col" style={{width:'100%'}}>
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:input-label-product-price')}
            </h1>
          </div>

          <div className="ms-auto flex w-full flex-col items-center space-y-4 md:flex-row md:space-y-0 xl:w-3/4" >
            <Search onSearch={handleSearch} />

            {/* <TypeFilter
              className="md:ms-6"
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
                setPage(1);
              }}
            /> */}

            {/* <div style={{flex: 'none',textTransform: 'uppercase'}}>
                  {locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.productPrice.create}`}
                className="md:ms-6 h-12 w-full md:w-auto "
              >
                <span className="block md:hidden xl:block">
                  + {t('form:button-label-add-product-price')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            )}
            </div> */}
          </div>
        </div>
      </Card>
      <PriceList
        prices={prices}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

ProductPrice.authenticate = {
  permissions: adminOnly,
};
ProductPrice.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
