import axios from "axios";
import MediaItem from "../models/MediaItem";

const baseURL: string = `${process.env.REACT_APP_API_URL}` || "";
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
        category: "movie",
        nativeId: selection.id,
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
        category: "tvshow",
        nativeId: selection.id,
      };
      return show;
    });
};

// Searches the met for an artpiece with a certain tag; cannot filter as robustly as others, so we need to search notable names and "similar"
export const getArtpiece = (): Promise<MediaItem> => {
  // Random number from 0-20; represents position in ObjectID array from API
  let randResultNum = Math.floor(Math.random() * 21);
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
  console.log(`Artpiece ResultNum:` + randResultNum);
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
            category: "artpiece",
            nativeId: selection.objectID,
          };
          // console.log(`Artpiece:`, selection);
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
  // randTagNum looks at array length 9, rounds down to max of 8, making 0-8
  let randTagNum = Math.floor(Math.random() * tagArray.length);
  // randResultNum is for an array, so 1-50 actually equals 0-49
  let randResultNum = Math.floor(Math.random() * 50);
  console.log(
    `Album TagNum: ` + randTagNum,
    `Album ResultNum: ` + randResultNum
  );
  let paramsObj = {
    api_key: lastFMKey as string,
    method: "tag.gettopalbums",
    format: "json",
    tag: tagArray[randTagNum],
    page: "1",
  };
  return axios
    .get(`http://ws.audioscrobbler.com/2.0/`, {
      params: paramsObj,
    })
    .then((response) => {
      let selection: any = response.data.albums.album[randResultNum];
      let selectionImg = Object.entries(selection.image[3])[0];
      const album: MediaItem = {
        title: selection.name,
        subtitle: selection.artist.name,
        artImg: selectionImg[1] as string,
        category: "album",
        nativeId: `${selection.artist.name}: ${selection.name}`,
      };
      // console.log(`Album:`, selection);
      return album;
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
            category: "videogame",
            nativeId: selection.id,
          };
          // console.log(`Video Game:`, response.data);
          return videoGame;
        });
    });
};
