import "./NavFriends.css";
import NavFriendListForm from "./NavFriendListForm";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavFriendByUID from "./NavFriendByUID";
import MatchupFeed from "./MatchupFeed";
import SocialContext from "../context/SocialContext";

const NavFriends = () => {
  const [displayJSX, setDisplayJSX] = useState<JSX.Element>();
  const { user } = useContext(SocialContext);
  const location = useLocation();
  const pathNameEnding = location.pathname.split("/").pop();

  const navFriendListFormJSX = <NavFriendListForm />;
  const friendFeedByUID = (
    <MatchupFeed userID={pathNameEnding} currentDisplay={"Friends"} />
  );

  useEffect(() => {
    console.log("Location Pathname Changed To: ", pathNameEnding);
    if (pathNameEnding != "friends" && pathNameEnding != "myfeed") {
      setDisplayJSX(friendFeedByUID);
    } else if (pathNameEnding === "friends") {
      setDisplayJSX(navFriendListFormJSX);
    }
  }, [location]);

  return <div className="NavFriends">{displayJSX}</div>;
};

export default NavFriends;
