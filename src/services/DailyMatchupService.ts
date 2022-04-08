import axios from "axios";
import DailyMatchupCollection from "../models/DailyMatchupCollection";

const baseURL: string = process.env.REACT_APP_API_URL || "";

export const getDailyMatchupCollection = async (
  date: Date
): Promise<DailyMatchupCollection> => {
  return (await axios.get(baseURL)).data;
};
