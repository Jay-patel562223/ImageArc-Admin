import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
  ChangePasswordInput,
  ForgetPasswordInput,
  VerifyForgetPasswordTokenInput,
  ResetPasswordInput,
  MakeAdminInput,
  BlockUserInput,
  WalletPointsInput,
  CreateUser,
  UpdateUser,
  QueryOptionsType,
  UserPaginator,
  UserQueryOptions,
  GetParams,
  Type,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const userClient = {
  me: () => {
    return HttpClient.get<User>(API_ENDPOINTS.ME);
  },
  login: (variables: LoginInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, variables);
  },
  logout: () => {
    return HttpClient.post<any>(API_ENDPOINTS.LOGOUT, {});
  },
  register: (variables: RegisterInput) => {

    let formData = new FormData();

    if(typeof variables?.image != 'string' || variables?.image != null){
      formData.append('image[]', variables?.image[0]);
    } 
    // formData.append('image', variables?.image);
    formData.append('first_name', variables?.first_name);
    formData.append('last_name', variables?.last_name);
    formData.append('mobile_no', variables?.mobile_no);
    formData.append('country', variables?.country);
    formData.append('state', variables?.state);
    formData.append('email', variables?.email);
    formData.append('password', variables?.password);
    formData.append('status', 'active');

    return HttpClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, formData);
  },
  create: (variables: RegisterInput) => {
    let formData = new FormData();

    if(typeof variables?.image != 'string' || variables?.image != null){
      formData.append('image[]', variables?.image[0]);
    } 
    // formData.append('image', variables?.image);
    formData.append('first_name', variables?.first_name);
    formData.append('last_name', variables?.last_name);
    formData.append('mobile_no', variables?.mobile_no);
    formData.append('country', variables?.country);
    formData.append('state', variables?.state);
    formData.append('email', variables?.email);
    formData.append('password', variables?.password);
    formData.append('status', 'active');

    return HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS, formData);
  },
  // create: ({  input }: { input: CreateUser }) => {
  //   return HttpClient.put<User>(`${API_ENDPOINTS.USERS}`, input);
  // },
  update: ({ id, input }: { id: string; input: any }) => {
    let formData = new FormData();


    if(typeof input?.image != 'string' || input?.image != null){
      formData.append('image[]', input?.image[0]);
    } 
    // formData.append('image', input?.image);
    formData.append('first_name', input?.first_name);
    formData.append('last_name', input?.last_name);
    formData.append('mobile_no', input?.mobile_no);
    formData.append('country', input?.country);
    formData.append('state', input?.state);
    formData.append('email', input?.email);
    formData.append('password', input?.password);
    formData.append('status', input?.status);
    
    return HttpClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, formData);
  },
  createNew: ({id,variables}:{id:String,variables:any}) => {
    return HttpClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, variables);
    // return HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS, variables);
  },
  changePassword: (variables: ChangePasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.CHANGE_PASSWORD, variables);
  },
  forgetPassword: (variables: ForgetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.FORGET_PASSWORD, variables);
  },
  verifyForgetPasswordToken: (variables: VerifyForgetPasswordTokenInput) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.VERIFY_FORGET_PASSWORD_TOKEN,
      variables
    );
  },
  resetPassword: (variables: ResetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.RESET_PASSWORD, variables);
  },
  makeAdmin: (variables: MakeAdminInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.MAKE_ADMIN, variables);
  },
  block: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.BLOCK_USER, variables);
  },
  unblock: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.UNBLOCK_USER, variables);
  },
  addWalletPoints: (variables: WalletPointsInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.ADD_WALLET_POINTS, variables);
  },
  fetchUsers: ({ name, ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.USERS, {
      searchJoin: 'and',
      with: 'wallet',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  fetchUser: ({ id }: { id: string }) => {
    return HttpClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  },
  delete({ id }: { id: string }) {
    return HttpClient.delete<boolean>(`${API_ENDPOINTS.USERS}/${id}`);
  },
  get({ slug }: { slug: string }) {
    return HttpClient.get<Type>(`${API_ENDPOINTS.USERS}/${slug}`);
  },
};
