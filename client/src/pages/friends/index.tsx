import { FriendCard } from '@/components';
import { Friend } from '@/dtos';
import { createStyles } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useStyles = createStyles(() => ({}));

export default function FriendsPage() {
  const { theme } = useStyles();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get('/friends', {
        params: {
          spDcCookie:
            'AQB0Vgolsf1bCeuHNA5bqjr-HXKxgUhvIsA_dXQKYPcVw-QbuQfkRAwSyQty7ltiqlAIJ2M5z8ejw3t71m4TqWRwB8IXmE3OZ48qYXpAZcQIvmFRJu5XmCj30M7Cy8G5mypVa_Aw1eHJPUVI_Wnkfxo8DfSNx5E',
        },
      });

      setFriends(res.data);
    };

    getFriends().catch((e) => console.log(e));
  }, []);

  return (
    <>
      {friends.map((friend: Friend) => (
        <FriendCard key={friend.user.id} friend={friend} />
      ))}
    </>
  );
}
