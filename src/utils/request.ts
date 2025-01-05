import axios from 'axios';

const service = axios.create({
    baseURL: '/mock-api',
    timeout: 50000
});

service.interceptors.request.use(config => {
    return config;
});

service.interceptors.response.use(response => {
    return response.data;
});

export default service;