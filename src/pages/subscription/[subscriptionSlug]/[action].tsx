import Layout from '@/components/layouts/admin';
import CreateOrUpdateSubscriptionForm from '@/components/subscription/subscription-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSubscriptionQuery } from '@/data/subscription';
import { Config } from '@/config';

export default function UpdateSubscription() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    subscription,
    isLoading: loading,
    error,
  } = useSubscriptionQuery({
    slug: query.subscriptionSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });



  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-subscription')}
        </h1>
      </div>

      <CreateOrUpdateSubscriptionForm initialValues={subscription} />
    </>
  );
}

UpdateSubscription.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
