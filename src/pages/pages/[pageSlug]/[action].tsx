import Layout from '@/components/layouts/admin';
import CreateOrUpdatePagesForm from '@/components/static_pages/page-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePageQuery } from '@/data/pages';
import { Config } from '@/config';

export default function UpdatePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    pages,
    isLoading: loading,
    error,
  } = usePageQuery({
    slug: query.pageSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-page')}
        </h1>
      </div>

      <CreateOrUpdatePagesForm initialValues={pages} />
    </>
  );
}

UpdatePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
