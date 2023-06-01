import axios, {AxiosResponse} from 'axios';
import {Config, FavorXConfig} from '../declare/global';

const FavorlabsService = axios.create({
    baseURL: 'https://service.favorlabs.io/api/v1',
    // timeout: 5e3,
});

export default {
    getConfig(networkId: number, name?: string):
      Promise<AxiosResponse<{ data: Config }>> {
        return FavorlabsService({
            url: '/appConfig',
            params: {
                networkId,
                name,
            },
        });
    },
    getFavorXConfig<T>(networkId: 'all' | 18 | 19 = 'all'):
      Promise<AxiosResponse<FavorXConfig[] | FavorXConfig>> {
        return FavorlabsService({
            url: `/favorxconfig?networkId=${networkId}&json=true`,
            timeout: 3000
        });
    }
};
