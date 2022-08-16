import { setLocalStorage } from '@/utils';
import axios from 'axios';
import { useEffect } from 'react';
import { history, Outlet } from 'umi';

// axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.baseURL = 'https://spotify-4-app.herokuapp.com/api';
axios.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (config.headers && accessToken) {
    config.headers['Access-Token'] = accessToken;
  }

  return config;
});

const getAccessToken = async () => {
  let accessToken = window.localStorage.getItem('access_token');
  let refreshToken = window.localStorage.getItem('refresh_token');
  let expiryDate = window.localStorage.getItem('expiry_date');

  if (!accessToken || !refreshToken || !expiryDate) {
    history.replace('/login');
    return;
  }

  if (new Date(expiryDate) < new Date()) {
    const axiosAuth = axios.create({
      // baseURL: 'http://localhost:3001/api',
      baseURL: 'https://spotify-4-app.herokuapp.com/api',
      headers: {
        'Refresh-Token': refreshToken,
      },
    });

    let expiresIn = '';
    ({ accessToken, expiresIn } = await axiosAuth
      .get('/refresh-token')
      .then((res) => res.data));

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + Number(expiresIn));
    if (accessToken && expiryDate) {
      setLocalStorage({ accessToken, expiryDate });
    } else {
      history.replace('/login');
    }
  }

  return accessToken;
};

const withAuth = () => {
  useEffect(() => {
    getAccessToken();
  });

  return <Outlet />;
};

export default withAuth;
