import axios from "axios";
import MediaItem from "../models/MediaItem";

// const baseURL: string = `${process.env.REACT_APP_API_URL}` || "";
const tmdbKey: string = `${process.env.REACT_APP_TMDB_KEY}` || "";
const lastFMKey: string = `${process.env.REACT_APP_LASTFM_KEY}` || "";
const rawGKey: string = `${process.env.REACT_APP_RAWG_KEY}` || "";

// Searches for a list of popular movies,then picks a random page, then a specific result at random
export const getMovie = (): Promise<MediaItem> => {
  // randPageNum should be 1-62
  let randPageNum = Math.floor(Math.random() * 62) + 1;
  // randResultNum is for an array, so 1-20 actually equals 0-19
  let randResultNum = Math.floor(Math.random() * 20);
  console.log(`Movie PageNum: ` + randPageNum, `ResultNum: ` + randResultNum);
  let paramsObj = {
    api_key: tmdbKey as string,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    "vote_count.gte": "2990",
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/movie`, {
      params: paramsObj,
    })
    .then((response) => {
      let selection: any = response.data.results[randResultNum];
      // console.log(`Movie:`, selection);
      const movie: MediaItem = {
        title: selection.title,
        subtitle: selection.release_date,
        artImg: `https://image.tmdb.org/t/p/w500/${selection.poster_path}`,
        artImg2: `https://image.tmdb.org/t/p/w500/${selection.backdrop_path}`,
        category: "Film",
        nativeId: selection.id,
        winner: false,
      };
      return movie;
    });
};

// Searches for a list of TV shows, picks a random page, then picks a random result
export const getTVShow = (): Promise<MediaItem> => {
  // randPageNum should be 1-15
  let randPageNum = Math.floor(Math.random() * 15) + 1;
  // randResultNum is for an array, so 1-20 actually equals 0-19
  let randResultNum = Math.floor(Math.random() * 20);
  console.log(`TVShow PageNum: ` + randPageNum, `ResultNum: ` + randResultNum);
  let paramsObj = {
    api_key: tmdbKey as string,
    language: "en-US",
    "vote_count.gte": "940",
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/tv`, {
      params: paramsObj,
    })
    .then((response) => {
      // console.log(`TV Show Page:` + paramsObj.page);
      let selection: any = response.data.results[randResultNum];
      // console.log(`TV Show:`, selection);
      const show: MediaItem = {
        title: selection.name,
        subtitle: selection.first_air_date,
        artImg: `https://image.tmdb.org/t/p/w500/${selection.poster_path}`,
        artImg2: `https://image.tmdb.org/t/p/w500/${selection.backdrop_path}`,
        category: "Television",
        nativeId: selection.id,
        winner: false,
      };
      return show;
    });
};

// Searches the met for an artpiece with a certain tag; cannot filter as robustly as others, so we need to search notable names and "similar"
export const getArtpiece = (): Promise<MediaItem> => {
  // Random number from 0-20; represents position in ObjectID array from API
  let randResultNum = Math.floor(Math.random() * 10);
  let artistArray = [
    "Vincent van Gogh",
    "Claude Monet",
    "Pablo Picasso",
    "Salvador Dali",
    "Rembrandt",
    "Frida Kahlo",
    "Jackson Pollock",
    "Andy Warhol",
  ];
  let randArtistNum = Math.floor(Math.random() * artistArray.length);
  console.log(
    `Artpiece ArtistNum:` + randArtistNum,
    `ResultNum:` + randResultNum
  );
  let paramsObj = {
    q: "",
    hasImages: "true",
    artistOrCulture: "Van Gogh",
  };
  return axios
    .get(`https://collectionapi.metmuseum.org/public/collection/v1/search`, {
      params: paramsObj,
    })
    .then((response) => {
      let artSelection = response.data.objectIDs[randResultNum];
      return axios
        .get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artSelection}`
        )
        .then((response) => {
          let selection: any = response.data;
          const artpiece: MediaItem = {
            title: selection.title,
            subtitle: selection.artistDisplayName,
            artImg: selection.primaryImageSmall,
            category: "Artwork",
            nativeId: selection.objectID,
            winner: false,
          };
          // console.log(`Artpiece:`, selection);
          return artpiece;
        });
    });
};

export const getAlbum = (): Promise<MediaItem> => {
  let randPageNum = Math.floor(Math.random() * 10);
  let randResultNum = Math.floor(Math.random() * 50);
  let paramsObj = {
    api_key: lastFMKey as string,
    method: "chart.gettopartists",
    format: "json",
    page: randPageNum.toString(),
  };
  return axios
    .get(`http://ws.audioscrobbler.com/2.0/`, {
      params: paramsObj,
    })
    .then((response) => {
      let artistID = response.data.artists.artist[randResultNum].name;
      let paramsObj2 = {
        api_key: lastFMKey as string,
        method: "artist.gettopalbums",
        format: "json",
        artist: artistID,
      };
      let randResultNum2 = Math.floor(Math.random() * 2);
      return axios
        .get(`http://ws.audioscrobbler.com/2.0/`, {
          params: paramsObj2,
        })
        .then((response) => {
          let selection: any = response.data.topalbums.album[randResultNum2];
          let selectionImg = Object.entries(selection.image[3])[0];
          const album: MediaItem = {
            title: selection.name,
            subtitle: selection.artist.name,
            artImg: selectionImg[1] as string,
            category: "Album",
            nativeId: `${selection.artist.name}: ${selection.name}`,
            winner: false,
          };
          // console.log(`Album:`, selection);
          return album;
        });
    });
};

// Searches for acclaimed video games, chooses a random page, chooses a random result, and then searches for the resutls ID to gather deeper info
export const getVideoGame = (): Promise<MediaItem> => {
  // randPageNum has +1 because its not an array; needs range of 1-20
  let randPageNum = Math.floor(Math.random() * 20) + 1;
  // randResultNum is for an array, so 1-20 actually equals 0-19
  let randResultNum = Math.floor(Math.random() * 20);
  console.log(
    `VidGame PageNum: ` + randPageNum,
    `VidGame ResultNum: ` + randResultNum
  );
  let paramsObj = {
    key: rawGKey as string,
    metacritic: "88,100",
    ordering: "-metacritic",
    exclude_additions: true,
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://api.rawg.io/api/games`, {
      params: paramsObj,
    })
    .then((response) => {
      let gameID = response.data.results[randResultNum].id;
      return axios
        .get(`https://api.rawg.io/api/games/${gameID}`, {
          params: { key: rawGKey as string },
        })
        .then((response) => {
          let selection: any = response.data;
          const videoGame: MediaItem = {
            title: selection.name,
            subtitle: selection.released,
            artImg: selection.background_image,
            artImg2: selection.background_image_additional,
            category: "Video Game",
            nativeId: selection.id,
            winner: false,
          };
          // console.log(`Video Game:`, response.data);
          return videoGame;
        });
    });
};
