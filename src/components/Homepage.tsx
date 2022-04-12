import { useEffect, useState } from "react";
import Matchup from "../models/Matchup";
import MediaItem from "../models/MediaItem";
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
  const [media1, setMedia1] = useState<MediaItem>({
    title: "",
    subtitle: "",
    artImg: "",
    artImg2: "",
    category: "",
    nativeId: "",
  });
  const [media2, setMedia2] = useState<MediaItem>();
  const getMediaArray = [
    getAlbum,
    getArtpiece,
    getMovie,
    getTVShow,
    getVideoGame,
  ];

  const generateMedia = async (selection: number): Promise<MediaItem> => {
    let media: MediaItem = {
      title: "",
      subtitle: "",
      artImg: "",
      artImg2: "",
      category: "",
      nativeId: "",
    };
    await getMediaArray[selection]().then((response) => {
      media = {
        title: response.title,
        subtitle: response.subtitle,
        artImg: response.artImg,
        artImg2: response.artImg2,
        category: response.category,
        nativeId: response.nativeId,
      };
    });
    return media;
  };

  const generateMatchup = () => {
    let randSelection = Math.floor(Math.random() * 5);
    let randSelection2 = Math.floor(Math.random() * 5);
    while (randSelection2 === randSelection) {
      randSelection2 = Math.floor(Math.random() * 5);
    }
    let media1 = generateMedia(randSelection);
    let media2 = generateMedia(randSelection2);
    while (!media1) {
      media1 = generateMedia(randSelection);
    }
    while (!media2) {
      media2 = generateMedia(randSelection2);
    }
    setMedia1(media1);
    setMedia2(media2);
    console.log(media1, media2);
  };

  const getAndSetMatchups = () => {
    getAllMatchups().then((response) => {
      setMatchups(response);
    });
  };

  useEffect(() => {
    getAndSetMatchups();
    generateMatchup().then(() => {
      console.log(media1, media2);
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
