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
    location.search.indexOf('&user='),
  );
  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + Number(expiresIn));
  const userId = location.search.slice(location.search.indexOf('&user=') + 6);

  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem(
    'expiry_date',
    `${expiryDate.toDateString()} ${expiryDate.toTimeString()}`,
  );
  localStorage.setItem('user_id', userId);

  useEffect(() => {
    history.replace('/home');
  });

  return <></>;
}
