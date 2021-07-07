let baseURL = 'https://api.covid19api.com';

const api = axios.create({
  baseURL,
});

api.defaults.headers.common = {};
api.defaults.headers.common.accept = 'application/json';
export default api;
