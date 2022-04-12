// First search; finds game and its ID to pass on for a deeper search of the ID
interface VideoGameResult {
  id: number;
}

export interface VideoGameResponse {
  results: VideoGameResult[];
}

// Second search; finds games detailed info, including developer
export interface VideoGameDeveloper {
  name: string;
  image_background: string;
}

export interface VideoGameDetails {
  name: string;
  background_image: string;
  background_image_additional: string;
  developers: VideoGameDeveloper[];
}
