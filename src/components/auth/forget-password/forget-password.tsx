import { useState } from 'react';
import Alert from '@/components/ui/alert';
import {
  useForgetPasswordMutation,
  useVerifyForgetPasswordTokenMutation,
  useResetPasswordMutation,
} from '@/data/user';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';

const EnterEmailView = dynamic(() => import('./enter-email-view'));
const EnterTokenView = dynamic(() => import('./enter-token-view'));
const EnterNewPasswordView = dynamic(() => import('./enter-new-password-view'));

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { mutate: forgetPassword, isLoading } = useForgetPasswordMutation();
  const { mutate: verifyToken, isLoading: verifying } =
    useVerifyForgetPasswordTokenMutation();
  const { mutate: resetPassword, isLoading: resetting } =
    useResetPasswordMutation();
  const [errorMsg, setErrorMsg] = useState<string | null | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | null | undefined>('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');

  function handleEmailSubmit({ email }: { email: string }) {
    forgetPassword(
      {
        email,
      },
      {
        onSuccess: (data) => {
          // if (data?.success) {
            setVerifiedEmail(email);
            setErrorMsg('');
          setSuccessMsg('');
            setSuccessMsg(data?.message);
          // } else {
          //   setErrorMsg(data?.message);
          // }
        },
        onError:(err)=>{
          setErrorMsg('');
          setSuccessMsg('');
          setErrorMsg(err?.response?.data?.message);
        }
      }
    );
  }

  function handleTokenSubmit({ token }: { token: string }) {
    verifyToken(
      {
        email: verifiedEmail,
        token: token.toString(),
      },
      {
        onSuccess: (data) => {
          setErrorMsg('');
          setSuccessMsg('');
            setVerifiedToken(token);
            setSuccessMsg(data?.message);
        },
        onError:(err)=>{
          setErrorMsg('');
          setSuccessMsg('');
          setErrorMsg(err?.response?.data?.message);
         
        }
      }
    );
  }

  function handleResetPassword({ password }: { password: string }) {
    resetPassword(
      {
        email: verifiedEmail,
        otp: verifiedToken,
        password,
      },
      {
        onSuccess: (data) => {
          // if (data?.success) {
            // Router.push('/');
          // } else {
            setErrorMsg('');
          setSuccessMsg('');
            setSuccessMsg(data?.message);
          // }
        },
        onError:(err)=>{
          setErrorMsg('');
          setSuccessMsg('');
          setErrorMsg(err?.response?.data?.message);
        }
      }
    );
  }
  return (
    <>
      {successMsg && (
        <Alert
          variant="success"
          message={successMsg}
          // message={t(`common:${errorMsg}`)}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg('')}
        />
      )}
      {errorMsg && (
        <Alert
          variant="error"
          message={errorMsg}
          // message={t(`common:${errorMsg}`)}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg('')}
        />
      )}
      {!verifiedEmail && (
        <EnterEmailView loading={isLoading} onSubmit={handleEmailSubmit} />
      )}
      {verifiedEmail && !verifiedToken && (
        <EnterTokenView loading={verifying} onSubmit={handleTokenSubmit} />
      )}
      {verifiedEmail && verifiedToken && (
        <EnterNewPasswordView
          loading={resetting}
          onSubmit={handleResetPassword}
        />
      )}
    </>
  );
};

export default ForgotPassword;
