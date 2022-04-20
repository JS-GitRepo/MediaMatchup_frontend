import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import MatchupFeed from "./MatchupFeed";
import "./NavPage.css";
import NavFooter from "./NavFooter";
import NavHeader from "./NavHeader";
import NavFriends from "./NavFriends";
import NavCommunity from "./NavCommunity";

interface Props {
  currentDisplay: string;
}

const NavPage = ({ currentDisplay }: Props) => {
  const { user } = useContext(SocialContext);
  const [centerDisplayJSX, setCenterDisplayJSX] = useState<JSX.Element>(
    <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
  );

  const matchupFeedJSX = (
    <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
  );
  const navFriendsJSX = <NavFriends />;
  const navCommunityJSX = <NavCommunity />;

  useEffect(() => {
    if (currentDisplay === "My Feed") {
      setCenterDisplayJSX(matchupFeedJSX);
    } else if (currentDisplay === "Friends") {
      setCenterDisplayJSX(navFriendsJSX);
    } else if (currentDisplay === "Community") {
      setCenterDisplayJSX(navCommunityJSX);
    }
  }, [currentDisplay]);

  return (
    <div className="NavPage">
      <NavHeader currentDisplay={currentDisplay} />
      {centerDisplayJSX}
      <NavFooter currentDisplay={currentDisplay} />
    </div>
  );
};

export default NavPage;
