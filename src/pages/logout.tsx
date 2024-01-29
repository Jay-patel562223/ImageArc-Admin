import { useEffect } from 'react';
import Loader from '@/components/ui/loader/loader';
import { useLogoutMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { AUTH_CRED } from '@/utils/constants';
import Cookies from 'js-cookie';
import { Routes } from '@/config/routes';

function SignOut() {
  const { t } = useTranslation();
  useLogoutMutation();

  // useEffect(() => {
  //   // logout();
  // }, []);

  // const router = useRouter();
  // Cookies.remove(AUTH_CRED);
  // router.replace(Routes.login);
  // toast.success(t('common:successfully-logout'));

  return <Loader text={t('common:signing-out-text')} />;
}

export default SignOut;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
