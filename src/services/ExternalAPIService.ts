import axios from "axios";
import ArtResponse from "../models/ArtResponse";
import MovieResponse from "../models/MovieResponse";

const baseURL: string = `${process.env.REACT_APP_API_URL}` || "";
const tmdbKey: string = `${process.env.REACT_APP_TMDB_KEY}` || "";

export const getMovie = (): Promise<MovieResponse> => {
  let paramsObj = {
    api_key: tmdbKey as string,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    "vote_count.gte": "3000",
    page: Math.floor(Math.random() * 63).toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/movie`, {
      params: paramsObj,
    })
    .then((response) => {
      return response.data;
    });
};

export const getArt = (): Promise<ArtResponse> => {
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
      return response.data;
    });
};
