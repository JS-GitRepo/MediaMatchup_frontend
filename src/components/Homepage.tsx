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
import MatchupCard from "./MatchupCard";

const Homepage = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [matchup, setMatchup] = useState<Matchup>();
  // const [match1, setMatch1] = useState<MediaItem>({
  //   title: "",
  //   subtitle: "",
  //   artImg: "",
  //   artImg2: "",
  //   category: "",
  //   nativeId: "",
  // });
  // const [match2, setMatch2] = useState<MediaItem>({
  //   title: "",
  //   subtitle: "",
  //   artImg: "",
  //   artImg2: "",
  //   category: "",
  //   nativeId: "",
  // });
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
    const startTime = Date.now();
    let randSelection = Math.floor(Math.random() * 5);
    let randSelection2 = Math.floor(Math.random() * 5);
    while (randSelection2 === randSelection) {
      randSelection2 = Math.floor(Math.random() * 5);
    }

    let media1 = await generateMedia(randSelection);
    let media2 = await generateMedia(randSelection2);
    // if (
    //   media1.title === null ||
    //   undefined ||
    //   "" ||
    //   media1.subtitle === null ||
    //   undefined ||
    //   "" ||
    //   media1.artImg === null ||
    //   undefined ||
    //   ""
    // ) {
    //   console.log(`Media1 generated again due to missing info.`);
    //   media1 = await generateMedia(randSelection);
    // }
    // if (
    //   media2.title === null ||
    //   undefined ||
    //   "" ||
    //   media2.subtitle === null ||
    //   undefined ||
    //   "" ||
    //   media2.artImg === null ||
    //   undefined ||
    //   ""
    // ) {
    //   console.log(`Media2 generated again due to missing info.`);
    //   media2 = await generateMedia(randSelection2);
    // }
    const endTime = Date.now() - startTime;
    console.log(
      `The 'generateMatchup' function took ${endTime} ms to complete.`
    );
    // setMatch1(media1);
    // setMatch2(media2);
    console.log(media1, media2);
    setMatchup({
      media1,
      media2,
    });
  };

  useEffect(() => {}, []);

  return (
    <div className="Homepage">
      {/* {matchup.map((item) => {
        return <p>{matchup.uid}</p>;
      })} */}
      <MatchupCard matchup={matchup} />
      <button onClick={generateMatchup}>GENERATE MATCHUP</button>
    </div>
  );
};

export default Homepage;
