import axios from "axios";
import UserAccount from "../models/UserAccount";

const baseURL: string = `${process.env.REACT_APP_API_URL}/user` || "";

export const getUserById = async (uid: string): Promise<UserAccount> => {
  return (await axios.get(baseURL, { params: { uid: uid } })).data;
};

export const createUserByID = async (
  user: UserAccount
): Promise<UserAccount> => {
  return await axios.post(baseURL, user);
};
