import { useEffect, useState } from "react";
import Matchup from "../models/Matchup";
import { getAllMatchups } from "../services/MatchupService";
import "./Homepage.css";

const Homepage = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);

  const getAndSetMatchups = () => {
    getAllMatchups().then((response) => {
      setMatchups(response);
    });
  };

  useEffect(() => {
    getAndSetMatchups();
  }, []);

  return (
    <div className="Homepage">
      {matchups.map((matchup) => {
        return <p>{matchup.uid}</p>;
      })}
    </div>
  );
};

export default Homepage;
