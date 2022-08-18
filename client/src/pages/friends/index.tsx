import { FriendCard, FriendTokenInput } from '@/components';
import { Friend } from '@/dtos';
import { createStyles } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useStyles = createStyles(() => ({}));

export default function FriendsPage() {
  const { theme } = useStyles();
  const [friends, setFriends] = useState([]);
  const [spDcCookie, setSpDcCookie] = useState('');
  const [cookieExpired, setCookieExpired] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = ({ token, expiry }: { token: string; expiry: string }) => {
    localStorage.setItem('sp_dc', token);
    localStorage.setItem('sp_dc_expiry', expiry);
    setSubmitted(true);
  };

  useEffect(() => {
    const getFriends = async () => {
      const cookie = window.localStorage.getItem('sp_dc');
      const expiry = window.localStorage.getItem('sp_dc_expiry');

      if (cookie && expiry) {
        setSpDcCookie(cookie);

        const res = await axios.get('/friends', {
          params: {
            spDcCookie: cookie,
          },
        });

        setFriends(res.data);
      }
    };

    getFriends().catch((e) => console.log(e));
  }, [submitted]);

  return (
    <>
      {spDcCookie ? (
        friends.map((friend: Friend) => (
          <FriendCard key={friend.user.id} friend={friend} />
        ))
      ) : (
        <FriendTokenInput
          submit={({ token, expiry }) => submit({ token, expiry })}
        />
      )}
    </>
  );
}
