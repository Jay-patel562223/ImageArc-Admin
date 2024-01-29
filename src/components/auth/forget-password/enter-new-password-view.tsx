import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';

interface Props {
  onSubmit: (values: { password: string }) => void;
  loading: boolean;
}

const schema = yup.object().shape({
  password: yup.string().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[+_!@#$%^&*])(?=.{8,})/,
    "Password Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character"
  ).required(),
  // password: yup.string().required('form:error-password-required'),
});

const EnterNewPasswordView = ({ onSubmit, loading }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({ resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PasswordInput
        label={t('form:input-label-password')}
        {...register('password')}
        error={t(errors.password?.message!)}
        variant="outline"
        className="mb-5"
      />

      <Button className="h-11 w-full" loading={loading} disabled={loading}>
        {t('form:text-reset-password')}
      </Button>
    </form>
  );
};

export default EnterNewPasswordView;
