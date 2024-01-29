import { Settings, SettingsInput, SettingsOptionsInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactorySettings } from './curd-factory-settings';
// import { crudFactory } from './curd-factory';
import { HttpClient } from '@/data/client/http-client';

export const settingsClient = {
  ...crudFactorySettings<Settings, any, SettingsOptionsInput>(API_ENDPOINTS.SETTINGS),
  all({ language }: { language: string }) {
    return HttpClient.get<Settings>(API_ENDPOINTS.SETTINGS, {
      language,
    });
  },
  update: ({ ...data }: SettingsInput) => {
    // let formData = new FormData();
    // formData.append('options', data.options);
    // formData.append('id', data.id);
    return HttpClient.post<Settings>(API_ENDPOINTS.SETTINGS, {...data});
    // return HttpClient.post<Settings>(API_ENDPOINTS.SETTINGS, { ...data });
  },
};
