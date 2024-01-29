import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useSystemConfigQuery } from '@/data/system-config';
import SystemConfigOrUpdateForm from '@/components/systemConfig/systemConfig-form';




export default function UpdateSystemConfig() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    systemConfig,
    isLoading: loading,
    error,
  } = useSystemConfigQuery({
    slug: query.systemConfigSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });



  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-system-config')}
        </h1>
      </div>

      <SystemConfigOrUpdateForm initialValues={systemConfig} />
    </>
  );
}

UpdateSystemConfig.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
