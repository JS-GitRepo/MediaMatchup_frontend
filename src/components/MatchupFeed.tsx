import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";
import { getMatchupsByUID } from "../services/MatchupService";
import "./MatchupFeed.css";
import MatchupFeedCard from "./MatchupFeedCard";

interface Props {
  userID: string | undefined;
  currentDisplay: string;
}

const MatchupFeed = ({ userID, currentDisplay }: Props) => {
  const [userMatchups, setUserMatchups] = useState<Matchup[]>([]);
  const { user } = useContext(SocialContext);

  const getAndSetMatchups = () => {
    getMatchupsByUID(user!.uid).then((response) => {
      setUserMatchups(response);
    });
  };

  useEffect(() => {
    if (user) {
      getAndSetMatchups();
    }
  }, []);

  return (
    <div className="MatchupFeed">
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
