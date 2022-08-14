import { setLocalStorage } from '@/utils';
import { useEffect } from 'react';
import { history, useLocation } from 'umi';

export default function CallbackPage() {
  const location = useLocation();
  const accessToken = location.search.slice(
    location.search.indexOf('access_token=') + 13,
    location.search.indexOf('&refresh_token='),
  );
  const refreshToken = location.search.slice(
    location.search.indexOf('&refresh_token=') + 15,
    location.search.indexOf('&expires_in='),
  );
  const expiresIn = location.search.slice(
    location.search.indexOf('&expires_in=') + 12,
  );
  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + Number(expiresIn));

  setLocalStorage({ accessToken, refreshToken, expiryDate });
  useEffect(() => {
    history.replace('/home');
  });

  return <></>;
}
