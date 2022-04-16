import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle, signOut } from "../firebaseConfig";
import DailyMatchupCollection from "../models/DailyMatchupCollection";
import Matchup from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import {
  getDailyMatchupCollection,
  postDailyMatchupCollection,
} from "../services/DailyMatchupService";
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
  const [dailyMatchups, setDailyMatchups] = useState<Matchup[]>();
  const [dailyIsComplete, setDailyIsComplete] = useState<Boolean>(false);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState<number>(0);
  const [bufferedMatchups, setBufferedMatchups] = useState<Matchup[]>([]);
  const [matchup, setMatchup] = useState<Matchup>();

  const { user } = useContext(SocialContext);
  const getMediaArray = [
    getAlbum,
    getArtpiece,
    getMovie,
    getTVShow,
    getVideoGame,
  ];

  const generateDateInfo = () => {
    const currentDate: Date = new Date();
    const detailedDate: number = Date.now();
    const simpleDate: number = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    return { currentDate, detailedDate, simpleDate };
  };

  const generateMedia = async (selection: number): Promise<MediaItem> => {
    return getMediaArray[selection]();
  };

  const generateMatchup = async (): Promise<Matchup> => {
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
    // console.log(media1, media2);
    // setMatchup({
    //   media1,
    //   media2,
    // });
    return { media1, media2 };
  };

  const generateMultipleMatchups = async (
    quantity: number
  ): Promise<Matchup[]> => {
    let matchupArray: Matchup[] = [];
    for (let i = 0; i < quantity; i++) {
      const matchup = await generateMatchup();
      matchupArray.push(matchup);
    }
    return matchupArray;
  };

  const checkAndSetDailyTen = (): void => {
    const dateInfo = generateDateInfo();
    const detailedDate = dateInfo.detailedDate;
    const simpleDate = dateInfo.simpleDate;

    getDailyMatchupCollection(simpleDate).then((response) => {
      if (response) {
        setDailyMatchups(response.matchups);
      } else {
        generateMultipleMatchups(10).then((response) => {
          let tempDailyMatchups = response.map((item, i) => ({
            ...item,
            dailyMatchupsIndex: i,
            dailyMatchupsDate: simpleDate,
          }));
          let dailyMatchupCollection: any = {
            detailedDate: detailedDate,
            simpleDate: simpleDate,
            matchups: tempDailyMatchups,
          };
          postDailyMatchupCollection(dailyMatchupCollection);
          setDailyMatchups(tempDailyMatchups);
        });
      }
    });
  };

  const checkAndSetBufferedMatchups = async (): Promise<void> => {
    let tempBuffer = bufferedMatchups;
    let bufferLength = tempBuffer.length;
    console.log(
      `There are ${bufferLength} items in the buffer when generation started.`
    );
    if (bufferLength < 3) {
      let initialMatchup = await generateMatchup();
      setMatchup(initialMatchup);
      tempBuffer.push(initialMatchup);
      for (bufferLength + 1; bufferLength < 3; bufferLength++) {
        tempBuffer.push(await generateMatchup());
      }
    } else {
      tempBuffer.shift();
      setMatchup(bufferedMatchups[0]);
      let tempMatchup = await generateMatchup();
      tempBuffer.push(tempMatchup);
    }
    setBufferedMatchups(tempBuffer);
  };

  const submitUserMatchupHandler = (
    winner: MediaItem,
    dailyMatchupIndex?: number
  ) => {
    // Establishes the winner based on which div is clicked (passed up via props)
    if (winner === matchup?.media1) {
      matchup.media1.winner = true;
      matchup.media2.winner = false;
      matchup.winner = matchup.media1.title;
    } else if (winner === matchup?.media2) {
      matchup.media1.winner = false;
      matchup.media2.winner = true;
      matchup.winner = matchup.media2.title;
    }
    if (dailyMatchupIndex === 9) {
      setDailyIsComplete(true);
    }
    matchup!.uid = user?.uid;
    matchup!.date = Date.now();
    matchup!.upvotes = 0;
    matchup!.downvotes = 0;

    submitMatchup(matchup!);
    checkAndSetBufferedMatchups();
  };

  // This use effect gets the date; sets a detailed and simplified version, then checks to see if a daily 10 has been submitted for the day. If not, it creates one, and sets it for the user. If it has been, it retrieves and sets it for the user.
  useEffect(() => {
    checkAndSetDailyTen();
    checkAndSetBufferedMatchups();
  }, []);

  //  Logs bufferedMatchups whenever the current matchup changes (to make sure the buffer is updating)
  useEffect(() => {
    console.log("Current Buffered Matchups: ", bufferedMatchups);
  }, [matchup]);

  // When dailyMatchups changes, this runs.
  useEffect(() => {
    console.log("Today's Daily Matchups: ", dailyMatchups);
  }, [dailyMatchups]);

  return (
    <div className="Homepage">
      {user ? (
        <div>
          <MatchupCard
            matchup={matchup}
            onSubmitMatchup={submitUserMatchupHandler}
          />
          <button onClick={checkAndSetBufferedMatchups}>
            GENERATE NEW MATCHUP
          </button>
        </div>
      ) : (
        <div></div>
      )}
      <Footer />
    </div>
  );
};

export default Homepage;
