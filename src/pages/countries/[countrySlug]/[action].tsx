import Layout from '@/components/layouts/admin';
import CreateOrUpdateCountriesForm from '@/components/country/country-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCountryQuery } from '@/data/country';
import { Config } from '@/config';

export default function UpdateCountry() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    countries,
    isLoading: loading,
    error,
  } = useCountryQuery({
    slug: query.countrySlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });



  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-country')}
        </h1>
      </div>

      <CreateOrUpdateCountriesForm initialValues={countries} />
    </>
  );
}

UpdateCountry.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
