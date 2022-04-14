import { ReactNode, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import SocialContext from "./SocialContext";

interface Props {
  children: ReactNode;
}

const SocialContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // useEffect to only register once at start
    return auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  return (
    <SocialContext.Provider value={{ user }}>{children}</SocialContext.Provider>
  );
};

export default SocialContextProvider;
