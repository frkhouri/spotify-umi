import { Me } from '@/dtos';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [me, setMe] = useState<Me>({} as Me);

  useEffect(() => {
    const getMe = async () => {
      const data = await axios.get('/me').then((res) => res.data);
      setMe(data);
    };
    getMe().catch((e) => console.log(e));
  }, []);

  return (
    <>
      <p>{me.display_name}</p>
    </>
  );
}
