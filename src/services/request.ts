import { message } from 'antd';
import { extend } from 'umi-request';

const getLocalData = (key: string) => {
  if (!key) {
    return;
  }
  try {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return data;
  } catch (e) {
    console.error(`tugraph ${key} %d ${e}`);
  }
};

const request = extend({
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('TUGRAPH_TOKEN') || ''//getLocalData('TUGRAPH_TOKEN'),
  },
  withCredentials: true,
  credentials: 'include',
  // 默认错误处理
  crossOrigin: true, // 开启CORS跨域
});

// 中间件
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  if (data.errorCode == 401) {
    message.warning('登录过期，请重新登录');
    window.location.href = '/admin/ks0v7y637ix';
  }
  if (data.errorCode == 400 || data.errorCode == 500) {
    message.error('请求失败' + data.errorMessage);
  }
  return response;
});

export default request;
