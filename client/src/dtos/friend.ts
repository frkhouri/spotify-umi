export type Friend = {
  time: string;
  user: {
    name: string;
    id: string;
    image: string;
  };
  track: {
    name: string;
    id: string;
    image: string;
    artist: {
      name: string;
      id: string;
    };
  };
  context: {
    name: string;
    id: string;
    type: string;
  };
};
