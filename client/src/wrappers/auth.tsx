import axios from 'axios';
import { useEffect } from 'react';
import { history, Outlet } from 'umi';

// axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.baseURL = 'https://spotify-4-app.herokuapp.com/api';
axios.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  const userId = localStorage.getItem('user_id');

  if (config.headers && accessToken && userId) {
    config.headers['Access-Token'] = accessToken;
    config.headers['User-Id'] = userId;
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
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem(
        'expiry_date',
        `${expiryDate.toDateString()} ${expiryDate.toTimeString()}`,
      );
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
