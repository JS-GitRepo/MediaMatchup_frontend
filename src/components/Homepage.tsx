import { useEffect, useState } from "react";
import Matchup from "../models/Matchup";
import {
  getAlbum,
  getArtpiece,
  getMovie,
  getTVShow,
  getVideoGame,
} from "../services/ExternalAPIService";
import { getAllMatchups } from "../services/MatchupService";
import "./Homepage.css";

const Homepage = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const getMediaArray = [
    getAlbum,
    getArtpiece,
    getMovie,
    getTVShow,
    getVideoGame,
  ];

  const generateMedia = () => {
    let randSelection = Math.floor(Math.random() * 5);
    getMediaArray[randSelection]().then((response) => {
      console.log(response);
    });
  };

  const generateMatchup = () => {};

  const getAndSetMatchups = () => {
    getAllMatchups().then((response) => {
      setMatchups(response);
    });
  };

  useEffect(() => {
    getAndSetMatchups();
    generateMedia();
    // getVideoGame().then((response) => {
    //   console.log(response);
    // });
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

// getMovie().then((response) => {
//   console.log(response);
// });
// getArtpiece().then((response) => {
//   console.log(response);
// });
// getShow().then((response) => {
//   console.log(response);
// });
// getAlbum().then((response) => {
//   onsole.log(responsce);
// });
// getVideoGame().then((response) => {
//   console.log(response);
// });
