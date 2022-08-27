export type HorizontalListProps = {
  heading: string;
  items: ListItem[];
};

export type List = {
  _id: string;
  name: string;
  items: ListItem[];
};

export type ListItem = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  type: 'playlist' | 'album' | 'show' | 'artist';
  owner: {
    id: string;
    name: string;
  };
};
