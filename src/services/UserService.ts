import axios from "axios";
import User from "../models/User";

const baseURL: string = process.env.REACT_APP_API_URL || "";

export const getAllUsers = async (): Promise<User[]> => {
  return (await axios.get(baseURL)).data;
};
