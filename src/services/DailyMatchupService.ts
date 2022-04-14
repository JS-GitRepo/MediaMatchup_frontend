import axios from "axios";
import DailyMatchupCollection from "../models/DailyMatchupCollection";

const baseURL: string = process.env.REACT_APP_API_URL || "";

export const getDailyMatchupCollection = async (
  date: number
): Promise<DailyMatchupCollection> => {
  return (await axios.get(baseURL, { params: { date: date } })).data;
};
