import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import MatchupFeed from "./MatchupFeed";
import "./NavPage.css";
import NavFooter from "./NavFooter";
import NavHeader from "./NavHeader";

interface Props {
  currentDisplay: string;
}

const NavPage = ({ currentDisplay }: Props) => {
  const { user } = useContext(SocialContext);
  const [currentDisplayJSX, setCurrentDisplayJSX] = useState<JSX.Element>(
    <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
  );

  useEffect(() => {}, []);
  return (
    <div className="NavPage">
      <NavHeader currentDisplay={currentDisplay} />
      <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
      <NavFooter currentDisplay={currentDisplay} />
    </div>
  );
};

export default NavPage;
