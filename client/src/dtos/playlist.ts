export type Playlist = {
  id: string;
  name: string;
  description: string;
  image: string;
  owner: {
    id: string;
    name: string;
  };
};
