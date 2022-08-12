import {
  NotificationsProvider,
  showNotification,
} from '@mantine/notifications';
import axios from 'axios';
import { X } from 'tabler-icons-react';
import { Outlet } from 'umi';

axios.interceptors.response.use(
  (res) => res,
  (e) => {
    console.log('this one', e);
    const { title, message } = e.response.data;
    showNotification({ title, message, color: 'red', icon: <X /> });
  },
);

const withNotifications = () => {
  return (
    <NotificationsProvider>
      <Outlet />
    </NotificationsProvider>
  );
};

export default withNotifications;
