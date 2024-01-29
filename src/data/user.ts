import { AUTH_CRED } from '@/utils/constants';
import { Routes } from '@/config/routes';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from './client/api-endpoints';
import { userClient } from './client/user';
import { User, QueryOptionsType, UserPaginator, GetParams } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useState } from 'react';
import Router from 'next/router';

export const useMeQuery = () => {
  return useQuery<User, Error>([API_ENDPOINTS.ME], userClient.me);
};

export function useLogin() {
  return useMutation(userClient.login);
}

export const useLogoutMutation = () => {
  const router = useRouter();
  const { t } = useTranslation();
 
  Cookies.remove(AUTH_CRED);
  router.replace(Routes.login);
  // toast.success(t('common:successfully-logout'));
  return true;
  // return useMutation({});
  // return useMutation(userClient.logout, {
  //   onSuccess: () => {
  //     Cookies.remove(AUTH_CRED);
  //     router.replace(Routes.login);
  //     toast.success(t('common:successfully-logout'));
  //   },
  // });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.register, {
    onSuccess: () => {
      toast.success(t('common:successfully-register'));
    },
    onError:(err)=>{
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGISTER);
    },
  });
};


export const useCreateMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  let [serverError, setServerError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(userClient.create, {
    onSuccess: () => {
      Router.push(Routes.user.list, undefined, {
      });
      toast.success(t('common:successfully-created'));
    },
    onError:(err)=>{
      setServerError(err?.response?.data?.message);
      setErrorMessage(err?.response?.data?.message);
      // toast.error(err.response.data.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGISTER);
    },
  });
  return { mutate, isLoading, serverError, setServerError,errorMessage, setErrorMessage };

};


export const useUpdateUserMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(userClient.update, {
    onSuccess: () => {
      setErrorMessage('');
      setTimeout(()=>{
        window.location.reload();
      },2000)
      toast.success(t('common:successfully-updated'));
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      // setTimeout(()=>{
        queryClient.invalidateQueries(API_ENDPOINTS.ME);
        queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      // },2000)
    },
  });
  return { mutate, isLoading, errorMessage, setErrorMessage };

}


export const useUpdateUserNewMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // let [serverError, setServerError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(userClient.update, {
    onSuccess: () => {
      // setServerError(null);
      Router.push(Routes.user.list);
      toast.success(t('common:successfully-updated'));
    },
    onError: (error) => {
      // setServerError(error?.response?.data?.message);
      setErrorMessage(error?.response?.data?.message);
      // toast.error(error?.response?.data?.message);
      // toast.error(t('error-something-wrong'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ME);
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
  return { mutate, isLoading, errorMessage, setErrorMessage };

};

export const useChangePasswordMutation = () => {
  return useMutation(userClient.changePassword);
  // const { t } = useTranslation();
  // const queryClient = useQueryClient();
  // return useMutation(userClient.changePassword, {
  //   onSuccess: () => {
  //     toast.success(t('common:successfully-updated'));
  //   },
  //   onError:(err)=>{
  //     toast.error(err.response.data.message);
  //   },
  //   // Always refetch after error or success:
  //   onSettled: () => {
  //     queryClient.invalidateQueries(API_ENDPOINTS.ME);
  //     queryClient.invalidateQueries(API_ENDPOINTS.USERS);
  //   },
  // });
};

export const useForgetPasswordMutation = () => {
  return useMutation(userClient.forgetPassword);
};

export const useVerifyForgetPasswordTokenMutation = () => {
  return useMutation(userClient.verifyForgetPasswordToken);
};

export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  // return useMutation(userClient.resetPassword);
  return useMutation(userClient.resetPassword, {
    onSuccess: (data) => {
      // if (data?.success) {
        Router.push(Routes.login);
        toast.success('Successfully Reset Password!');
        
        return;
      // } 
    },
    onError:(err)=>{
      toast.error(err?.response?.data?.message);


    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.LOGIN);
    },
  });
};

export const useMakeOrRevokeAdminMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.makeAdmin, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.block, {
    onSuccess: () => {
      toast.success(t('common:successfully-block'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      queryClient.invalidateQueries(API_ENDPOINTS.STAFFS);
    },
  });
};

export const useUnblockUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.unblock, {
    onSuccess: () => {
      toast.success(t('common:successfully-unblock'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      queryClient.invalidateQueries(API_ENDPOINTS.STAFFS);
    },
  });
};

export const useAddWalletPointsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(userClient.addWalletPoints, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};

export const useUserQuery = ({ id }: { id: string }) => {
  return useQuery<User, Error>(
    [API_ENDPOINTS.USERS, id],
    () => userClient.fetchUser({ id }),
    {
      enabled: Boolean(id),
    }
  );
};

export const useUsersQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<UserPaginator, Error>(
    [API_ENDPOINTS.USERS, params],
    () => userClient.fetchUsers(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    users: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};


export const useUserNewQuery = ({ slug, language }: GetParams) => {
  let id= slug;
  const { data, error, isLoading } = useQuery<User, Error>(
    [API_ENDPOINTS.USERS, slug],
    () => userClient.fetchUser({id}),
    {
      enabled: Boolean(slug),
    }
  );

  // const { data, error, isLoading } = useQuery<User, Error>(
  //   [API_ENDPOINTS.USERS, { slug, language }],
  //   () => userClient.fetchUser( slug )
  // );

  return {
    users: data?.data,
    error,
    isLoading,
  };
}


export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};
