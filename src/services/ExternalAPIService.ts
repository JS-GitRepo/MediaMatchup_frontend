import axios from "axios";
import MediaItem from "../models/MediaItem";

const baseURL: string = `${process.env.REACT_APP_API_URL}` || "";
const tmdbKey: string = `${process.env.REACT_APP_TMDB_KEY}` || "";
const lastFMKey: string = `${process.env.REACT_APP_LASTFM_KEY}` || "";
const rawGKey: string = `${process.env.REACT_APP_RAWG_KEY}` || "";

// Searches for a list of popular movies,then picks a random page, then a specific result at random
export const getMovie = (): Promise<MediaItem> => {
  let paramsObj = {
    api_key: tmdbKey as string,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    "vote_count.gte": "3000",
    page: (Math.floor(Math.random() * 63) + 1).toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/movie`, {
      params: paramsObj,
    })
    .then((response) => {
      const selection: any =
        response.data.results[Math.floor(Math.random() * 20) + 1];
      console.log(`Movie:`, selection);
      const movie: MediaItem = {
        title: selection.title,
        subtitle: selection.release_date,
        artImg: `https://image.tmdb.org/t/p/w500/${selection.poster_path}`,
        artImg2: `https://image.tmdb.org/t/p/w500/${selection.backdrop_path}`,
        category: "movie",
        nativeId: selection.id,
      };
      return movie;
    });
};

// Searches for a list of TV shows, picks a random page, then picks a random result
export const getTVShow = (): Promise<MediaItem> => {
  let paramsObj = {
    api_key: tmdbKey as string,
    language: "en-US",
    "vote_count.gte": "1000",
    page: (Math.floor(Math.random() * 15) + 1).toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/tv`, {
      params: paramsObj,
    })
    .then((response) => {
      const selection: any =
        response.data.results[Math.floor(Math.random() * 20) + 1];
      console.log(`TV Show:`, selection);
      const show: MediaItem = {
        title: selection.name,
        subtitle: selection.first_air_date,
        artImg: `https://image.tmdb.org/t/p/w500/${selection.poster_path}`,
        artImg2: `https://image.tmdb.org/t/p/w500/${selection.backdrop_path}`,
        category: "tvshow",
        nativeId: selection.id,
      };
      return show;
    });
};

// Searches the met for an artpiece with a certain tag; cannot filter as robustly as others, so we need to search notable names and "similar"
export const getArtpiece = (): Promise<MediaItem> => {
  let paramsObj = {
    q: "",
    hasImages: "true",
    artistOrCulture: "Vincent",
  };
  return axios
    .get(`https://collectionapi.metmuseum.org/public/collection/v1/search`, {
      params: paramsObj,
    })
    .then((response) => {
      let artSelection =
        response.data.objectIDs[Math.floor(Math.random() * 10) + 1];
      return axios
        .get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artSelection}`
        )
        .then((response) => {
          const selection: any = response.data;
          const artpiece: MediaItem = {
            title: selection.title,
            subtitle: selection.artistDisplayName,
            artImg: selection.primaryImageSmall,
            category: "artpiece",
            nativeId: selection.objectID,
          };
          console.log(`Artpiece:`, selection);
          return artpiece;
        });
    });
};

// Searches Last FM for a list of most popular albums containing a random tag from the array, then picks a random result from the first page of 50 results
export const getAlbum = (): Promise<MediaItem> => {
  let tagArray: string[] = [
    "Hip-Hop",
    "hip hop",
    "rock",
    "electronic",
    "alternative",
    "metal",
    "classic rock",
    "punk",
    "rap",
  ];
  let paramsObj = {
    api_key: lastFMKey as string,
    method: "tag.gettopalbums",
    format: "json",
    tag: tagArray[Math.floor(Math.random() * tagArray.length)],
    page: "1",
  };
  return axios
    .get(`http://ws.audioscrobbler.com/2.0/`, {
      params: paramsObj,
    })
    .then((response) => {
      const selection: any =
        response.data.albums.album[Math.floor(Math.random() * 50) + 1];
      const selectionImg = Object.entries(selection.image[3])[0];
      const album: MediaItem = {
        title: selection.name,
        subtitle: selection.artist.name,
        artImg: selectionImg[1] as string,
        category: "album",
        nativeId: `${selection.artist.name}: ${selection.name}`,
      };
      console.log(`Album:`, selectionImg[1]);
      return album;
    });
};

// Searches for acclaimed video games, chooses a random page, chooses a random result, and then searches for the resutls ID to gather deeper info
export const getVideoGame = (): Promise<MediaItem> => {
  let paramsObj = {
    key: rawGKey as string,
    metacritic: "88,100",
    ordering: "-metacritic",
    exclude_additions: true,
    page: (Math.floor(Math.random() * 20) + 1).toString(),
  };
  return axios
    .get(`https://api.rawg.io/api/games`, {
      params: paramsObj,
    })
    .then((response) => {
      let gameID = response.data.results[Math.floor(Math.random() * 20) + 1].id;
      return axios
        .get(`https://api.rawg.io/api/games/${gameID}`, {
          params: { key: rawGKey as string },
        })
        .then((response) => {
          const selection: any = response.data;
          const videoGame: MediaItem = {
            title: selection.name,
            subtitle: selection.released,
            artImg: selection.background_image,
            artImg2: selection.background_image_additional,
            category: "videogame",
            nativeId: selection.id,
          };
          console.log(`Video Game:`, response.data);
          return videoGame;
        });
    });
};
