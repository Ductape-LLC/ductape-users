import axios, { AxiosInstance, CancelToken } from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const requestInterceptor = async (config: { cancelToken: CancelToken; }) => {
  config.cancelToken = source.token;
  return config;
};
let instance: AxiosInstance;

const client = (baseURL: string, auth: string, contentType: string) => {
  if (instance) return instance;
  instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': contentType,
      Authorization: auth
    },
    withCredentials: true
  });

  // @ts-ignore
  instance.interceptors.request.use(requestInterceptor);
  return instance;
};

export default client;
