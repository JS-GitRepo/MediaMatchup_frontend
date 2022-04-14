import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";
import { getMatchupsByUID } from "../services/MatchupService";
import Footer from "./Footer";
import "./MatchupFeed.css";
import MatchupFeedCard from "./MatchupFeedCard";

const MatchupFeed = () => {
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
      <ul>
        {userMatchups.map((matchupCard) => {
          return <MatchupFeedCard matchup={matchupCard} />;
        })}
      </ul>
      <Link to="/">
        <button>Return to Matchups</button>
      </Link>
      <Footer />
    </div>
  );
};

export default MatchupFeed;
