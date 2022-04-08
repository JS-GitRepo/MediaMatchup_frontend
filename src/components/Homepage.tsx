import { useEffect, useState } from "react";
import Matchup from "../models/Matchup";
import { getArt, getMovie } from "../services/ExternalAPIService";
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
    getMovie().then((response) => {
      console.log(response.results[Math.floor(Math.random() * 20)]);
    });
    getArt().then((response) => {
      console.log(response.objectIDs[Math.floor(Math.random() * 10)]);
    });
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
