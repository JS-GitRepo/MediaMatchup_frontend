import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";
import { getMatchupsByUID } from "../services/MatchupService";
import { getUserById } from "../services/UserService";
import "./MatchupFeed.css";
import MatchupFeedCard from "./MatchupFeedCard";

interface Props {
  userID: string | undefined;
  currentDisplay: string;
}

const MatchupFeed = ({ userID, currentDisplay }: Props) => {
  const [userMatchups, setUserMatchups] = useState<Matchup[]>([]);

  const getAndSetMatchups = () => {
    getMatchupsByUID(userID!).then((response) => {
      setUserMatchups(response);
    });
  };

  useEffect(() => {
    if (userID) {
      getAndSetMatchups();
    }
  }, [userID]);

  return (
    <div className="MatchupFeed">
      <h1 className="title">{`Feed`}</h1>
      <ul className="matchup-feed-list">
        {userMatchups.map((matchupCard, i) => {
          return (
            <MatchupFeedCard key={`Matchup: ${i}`} matchup={matchupCard} />
          );
        })}
      </ul>
    </div>
  );
};

export default MatchupFeed;
