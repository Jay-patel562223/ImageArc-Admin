import Image from 'next/image';
import { CheckMarkFill } from '@/components/icons/checkmark-circle-fill';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery } from '@/data/user';

const UserDetails: React.FC = () => {
  const { t } = useTranslation('common');
  const { data, isLoading: loading } = useMeQuery();
  if (loading) return <Loader text={t('text-loading')} />;

  const { first_name,last_name, email, image,mobile_no, is_active } = data!;
  return (
    <div className="flex h-full flex-col items-center p-5">
      <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-gray-200">
      {/* <img src={me?.image} alt="" height="100px" width="100px" className="mb-4"/> */}
       
        <img
          src={image ?? '/avatar-placeholder.svg'}
          // layout="fill"
          alt={first_name}
       style={{height: '100%',width: '100%'}}

        />
        {/* <Image
          src={image ?? '/avatar-placeholder.svg'}
          layout="fill"
          alt={first_name}
        /> */}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-heading">{first_name +' '+last_name}</h3>
      {/* <h3 className="mt-4 text-lg font-semibold text-heading">{name}</h3> */}
      <p className="mt-1 text-sm text-muted">{email}</p>
      {/* {!profile ? (
        <p className="mt-0.5 text-sm text-muted">
          {t('text-add-your')}{' '}
          <Link href={Routes.profileUpdate} className="text-accent underline">
            {t('authorized-nav-item-profile')}
          </Link>
        </p>
      ) : ( */}
        <>
          <p className="mt-0.5 text-sm text-muted">{mobile_no}</p>
          {/* <p className="mt-0.5 text-sm text-muted">{profile.contact}</p> */}
        </>
      {/* )} */}
      {/* <div className="mt-6 flex items-center justify-center rounded border border-gray-200 py-2 px-3 text-sm text-body-dark">
        {is_active ? (
          <CheckMarkFill width={16} className="me-2 text-accent" />
        ) : (
          <CloseFillIcon width={16} className="me-2 text-red-500" />
        )}
        {is_active ? 'Enabled' : 'Disabled'}
      </div> */}
    </div>
  );
};
export default UserDetails;
