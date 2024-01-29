import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useUpdateUserMutation } from '@/data/user';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import pick from 'lodash/pick';
import Alert from '../ui/alert';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { useCountrysQuery } from '@/data/country';
import Select from '../ui/select/select';
import { useState } from 'react';
import { useStateCountryQuery } from '@/data/state';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';


type FormValues = {
  image:any,
  first_name:string,
  last_name:string,
  mobile_no:number,
  country:object,
  state:object,
  // name: string;
  // user_name: string,
  // email: string;
  // password: string;
  // permission: Permission;
};
// type FormValues = {
//   name: string;
//   profile: {
//     id: string;
//     bio: string;
//     contact: string;
//     avatar: {
//       thumbnail: string;
//       original: string;
//       id: string;
//     };
//   };
// };

export default function ProfileUpdate({ me }: any) {
  const { t } = useTranslation();
  const { mutate: updateUser, isLoading: loading,errorMessage } = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      ...(me &&
        pick(me, [
          'first_name',
          'last_name',
          'email',
          'mobile_no',
          'country',
          'state',
          'status'
        ])),
        // pick(me, ['name', 'profile.bio', 'profile.contact', 'profile.avatar'])),
    },
  });


  const { countries, paginatorInfo,  error } = useCountrysQuery({
    limit: 10000,
  });

  const { query, locale } = useRouter();
   

  const [stateData, setStateData] = useState<object | null>([me?.state]);
  const [countryData, setCountryData] = useState<object | null>(me?.country);
  const [newStateData, setNewStateData] = useState<object | null>(me?.state);
      

  console.log("stateData",stateData);

  const changeValue = async (e: any) => {
    setCountryData(e);
   await fetch(process.env.NEXT_PUBLIC_REST_API_ENDPOINT+''+API_ENDPOINTS.STATES_COUNTRY+'/'+e?._id).then( async(res)=>{
     const data = await res.json();
     console.log("data", data);
     setStateData(data?.data);
    }).catch((err)=>{
        console.log("err", err)
    });
  
  }

  const changeState = (e: any) => {
    console.log("e", e)
    setNewStateData(e);
  }
  async function onSubmit(values: FormValues) {


    const { 
      image,
      first_name,
      last_name,
      mobile_no,
      country,
      state,
      // email,
      // password,,
    //  name, profile 
    } = values;
    

    updateUser({
      id: me?._id,
      input: {
        image:image,
        first_name:first_name,
        last_name:last_name,
        mobile_no:mobile_no,
        country:JSON.stringify(countryData),
        state:JSON.stringify(newStateData),
        email:me?.email,
        status:me?.newStatus,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-avatar')}
          details={t('form:avatar-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="profile.avatar" control={control} multiple={false} />
        </Card>
      </div> */}

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <h1 className="text-lg font-semibold text-heading sm:pe-4 md:pe-5 w-full px-0 pb-5">
          Profile Settings
        
          </h1>
            {/* <Description
              title="Profile Settings"
              // details={t('form:profile-info-help-text')}
              className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-12/12 sm:py-8 md:w-3/3"
            /> */}
          <Card className="mb-5 w-full sm:w-12/12 md:w-3/3 ">

          {errorMessage && 
          <Alert className="mb-4" variant={errorMessage ? 'errorOutline' : 'info'} message={errorMessage ?? ''} />
          }

            <Label>Image</Label>
            <Input
              type="file"  
              // label={t('text-image')}
              {...register('image')}
              // variant="inline"
              className="mb-4"
              error={t(errors.image?.message!)}
              // error={t(errors?.first_name?.message!)}
            />

            {me?.image ?
              <img src={me?.image} alt="" height="100px" width="100px" className="mb-4" />
             : "" 
            }


            <Input
              label={t('form:input-label-first_name')}
              {...register('first_name')}
              variant="outline"
              className="mb-4"
              error={t(errors?.first_name?.message!)}
              maxLength={30}
            />
            <Input
              label={t('form:input-label-last_name')}
              {...register('last_name')}
              variant="outline"
              className="mb-4"
              error={t(errors?.last_name?.message!)}
              maxLength={30}
            />
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors?.email?.message!)}
              disabled
            />
            {/* <PasswordInput
              label={t('form:input-label-password')}
              {...register('password')}
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-4"
            /> */}
            <Input
              label={t('form:input-label-mobile')}
              type="number"
              {...register('mobile_no')}
              variant="outline"
              className="mb-4"
              error={t(errors?.mobile_no?.message!)}
            />

              <Label>Country</Label>
              <Select
                name='country'
                getOptionLabel={(option: any) => option?.country}
                getOptionValue={(option: any) => option?.country}
                isMulti={false}
                options={countries}
                // options={countries}
                onChange={changeValue}
                className="mb-4"
                defaultValue={[me?.country]}
              />
              {/* <SelectInput
                name="country"
                // isMulti
                control={control}
                getOptionLabel={(option: any) => option?.country}
                getOptionValue={(option: any) => option?.country}
                // @ts-ignore
                options={countries}
                isLoading={loading}
                onChange={changeValue}
              /> */}
            {/* <Input
              label={t('form:input-label-country_name')}
              {...register('country')}
              variant="outline"
              className="mb-4"
              error={t(errors?.country?.message!)}
            /> */}
             <Label>State</Label>
              <Select
                name='state'
                getOptionLabel={(option: any) => option?.states}
                getOptionValue={(option: any) => option?.states}
                isMulti={false}
                options={stateData}
                className="mb-4"
                onChange={changeState}
                defaultValue={stateData}
                // onChange={changeValue}
              />
            {/* <Input
              label={t('form:input-label-state_name')}
              {...register('state')}
              variant="outline"
              className="mb-4"
              error={t(errors?.state?.message!)}
            /> */}
          </Card>

        {/* <Description
          title={t('form:form-title-information')}
          details={t('form:profile-info-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />

        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t('form:input-label-bio')}
            {...register('profile.bio')}
            error={t(errors.profile?.bio?.message!)}
            variant="outline"
            className="mb-6"
          />
          <Input
            label={t('form:input-label-contact')}
            {...register('profile.contact')}
            error={t(errors.profile?.contact?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card> */}

        <div className="text-end w-full">
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
