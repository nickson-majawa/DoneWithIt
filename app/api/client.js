import { create } from 'apisauce';
import cache from '../utility/cache';
import authStorage from '../auth/storage';
import settings from '../config/settings';

const apiCLient = create({
    baseURL: settings.apiUrl,
});

apiCLient.addAsyncRequestTransform(async (request) => {
    const authToken = await authStorage.getToken();
    if (!authToken) return;
    request.headers["x-auth-token"] = authToken;

});

const get = apiCLient.get;
apiCLient.get = async (url, params, axiosConfig) => {

    const response = await get(url, params, axiosConfig);

    if (response.ok) {
        cache.store(url, response.data);
        return response;
    }

    const data = await cache.get(url);
    return data ? { ok: true, data } : response;

};

export default apiCLient;