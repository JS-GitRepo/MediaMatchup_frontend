interface AlbumImage {
  text: string;
  size: string;
}

export interface AlbumDetails {
  name: string;
  artist: {};
  image: AlbumImage[];
}

export interface AlbumResponse {
  album: AlbumDetails[];
}
