import axios from "axios";
import Matchup from "../models/Matchup";

const baseURL: string = `${process.env.REACT_APP_API_URL}/matchups` || "";

export const getAllMatchups = async (): Promise<Matchup[]> => {
  return (await axios.get(baseURL)).data;
};

export const submitMatchup = async (matchup: Matchup): Promise<Matchup> => {
  return (await axios.post(baseURL, matchup)).data;
};
