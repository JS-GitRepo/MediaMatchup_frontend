import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle, signOut } from "../firebaseConfig";
import DailyMatchupCollection from "../models/DailyMatchupCollection";
import Matchup from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import { getDailyMatchupCollection } from "../services/DailyMatchupService";
import {
  getAlbum,
  getArtpiece,
  getMovie,
  getTVShow,
  getVideoGame,
} from "../services/ExternalAPIService";
import { submitMatchup } from "../services/MatchupService";
import Footer from "./Footer";
import "./Homepage.css";
import MatchupCard from "./MatchupCard";

const Homepage = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [matchup, setMatchup] = useState<Matchup>();
  const { user } = useContext(SocialContext);

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

  const generateMatchup = async (): Promise<any> => {
    const startTime = Date.now();
    let randSelection = Math.floor(Math.random() * 5);
    let randSelection2 = Math.floor(Math.random() * 5);
    while (randSelection2 === randSelection) {
      randSelection2 = Math.floor(Math.random() * 5);
    }

    let [media1, media2] = await Promise.all([
      generateMedia(randSelection),
      generateMedia(randSelection2),
    ]);

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
      console.log(`Media1 generated again due to missing info.`);
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
      console.log(`Media2 generated again due to missing info.`);
      media2 = await generateMedia(randSelection2);
    }
    const endTime = Date.now() - startTime;
    console.log(
      `The 'generateMatchup' function took ${endTime} ms to complete.`
    );
    console.log(media1, media2);
    setMatchup({
      media1,
      media2,
    });
    return { media1, media2 };
  };

  // TODO
  const checkDailyTen = (): void => {
    const currentDate = new Date();
    const currentDetailedDate = Date.now();
    const simpleDate = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    // let dailyResponse: any = [];
    // getDailyMatchupCollection(simpleDate).then((response) => {
    //   dailyResponse = response;
    //   if (dailyResponse === []) {
    //   }
    // });
    const reconstructedDate = new Date(simpleDate);
    console.log(simpleDate);
    console.log(currentDetailedDate);
    console.log(reconstructedDate);
  };

  // TODO
  const generateDailyTen = (): void => {
    let dailyTen: Matchup[] = [];
    for (let i = 0; i < 10; i++) {
      generateMatchup().then((response) => {
        dailyTen.push(response);
      });
    }
    console.log(dailyTen);
  };

  const submitMatchupHandler = (winner: MediaItem) => {
    // Establish the winner based on click
    if (winner === matchup?.media1) {
      matchup.media1.winner = true;
      matchup.media2.winner = false;
      matchup.winner = matchup.media1.title;
    } else if (winner === matchup?.media2) {
      matchup.media1.winner = false;
      matchup.media2.winner = true;
      matchup.winner = matchup.media2.title;
    }
    matchup!.uid = user?.uid;
    matchup!.date = Date.now();
    matchup!.upvotes = 0;
    matchup!.downvotes = 0;
    console.log(matchup);
    submitMatchup(matchup!).then(() => {
      generateMatchup().then((response) => {
        setMatchup(response);
      });
    });
  };

  useEffect(() => {
    generateMatchup().then((response) => {
      console.log(response);
      setMatchup(response);
    });
  }, []);

  return (
    <div className="Homepage">
      {user ? (
        <div>
          <MatchupCard
            matchup={matchup}
            onSubmitMatchup={submitMatchupHandler}
          />
          <button onClick={generateMatchup}>GENERATE NEW MATCHUP</button>
        </div>
      ) : (
        <div></div>
      )}
      <Footer />
    </div>
  );
};

export default Homepage;
