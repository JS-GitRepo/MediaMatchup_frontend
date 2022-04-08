import MediaItem from "./MediaItem";

interface Comment {
  uid: string;
  name: string;
  avatar: string;
  text: string;
  date: Date;
}

// "winner?" represents the title of the winning media item
export default interface Matchup {
  _id?: string;
  media1: MediaItem;
  media2: MediaItem;
  uid?: string;
  date?: Date;
  winner?: string;
  upvotes?: number;
  downvotes?: number;
  comments?: Comment[];
}
