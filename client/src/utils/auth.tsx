type tokens = {
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
};

export const setLocalStorage = ({
  accessToken,
  refreshToken,
  expiryDate,
}: tokens) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem(
    'expiry_date',
    `${expiryDate.toDateString()} ${expiryDate.toTimeString()}`,
  );

  return;
};
