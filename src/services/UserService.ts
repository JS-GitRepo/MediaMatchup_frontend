import axios from "axios";
import UserAccount from "../models/UserAccount";

const baseURL: string = `${process.env.REACT_APP_API_URL}/user` || "";

export const getUserById = async (uid: string): Promise<UserAccount> => {
  return (await axios.get(baseURL, { params: { uid: uid } })).data;
};

export const createUserByID = async (
  user: UserAccount
): Promise<UserAccount> => {
  return (await axios.post(baseURL, user)).data;
};

export const updateUserDailiesByID = async (
  uid: string,
  updateParams: any
): Promise<UserAccount> => {
  return (await axios.put(`${baseURL}/${uid}`, updateParams)).data;
};
