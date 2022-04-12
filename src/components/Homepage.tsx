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
  const [media2, setMedia2] = useState<MediaItem>({
    title: "",
    subtitle: "",
    artImg: "",
    artImg2: "",
    category: "",
    nativeId: "",
  });
  const getMediaArray = [
    getAlbum,
    getArtpiece,
    getMovie,
    getTVShow,
    getVideoGame,
  ];

  const generateMedia = async (selection: number): Promise<MediaItem> => {
    return await getMediaArray[selection]();
  };

  const generateMatchup = async (): Promise<void> => {
    let randSelection = Math.floor(Math.random() * 5);
    let randSelection2 = Math.floor(Math.random() * 5);
    while (randSelection2 === randSelection) {
      randSelection2 = Math.floor(Math.random() * 5);
    }

    let media1 = await generateMedia(randSelection);
    let media2 = await generateMedia(randSelection2);
    if (
      media1.title === null ||
      undefined ||
      "" ||
      media1.subtitle === null ||
      undefined ||
      "" ||
      media1.artImg === null ||
      undefined ||
      ""
    ) {
      media1 = await generateMedia(randSelection);
    }
    if (
      media2.title === null ||
      undefined ||
      "" ||
      media2.subtitle === null ||
      undefined ||
      "" ||
      media2.artImg === null ||
      undefined ||
      ""
    ) {
      media2 = await generateMedia(randSelection2);
    }
    console.log(media1, media2);
    setMedia1(media1);
    setMedia2(media2);
  };

  useEffect(() => {
    generateMatchup();
  }, []);

  return (
    <div className="Homepage">
      {matchups.map((matchup) => {
        return <p>{matchup.uid}</p>;
      })}
      <button onClick={generateMatchup}>GENERATE MATCHUP</button>
    </div>
  );
};

export default Homepage;
