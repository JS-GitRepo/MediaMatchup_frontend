import { useContext, useEffect, useRef, useState } from "react";
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
import { getUserById, updateUserDailiesByID } from "../services/UserService";
import Footer from "./Footer";
import "./Homepage.css";
import MatchupCard from "./MatchupCard";
import StatsCard from "./StatsCard";

const Homepage = () => {
  const [dailyMatchups, setDailyMatchups] = useState<Matchup[]>([]);
  const [dailyIsComplete, setDailyIsComplete] = useState<Boolean>(false);
  const [bufferedMatchups, setBufferedMatchups] = useState<Matchup[]>([]);
  const [matchup, setMatchup] = useState<Matchup>();
  const [cardType, setCardType] = useState<JSX.Element>();
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const { user } = useContext(SocialContext);
  const getMediaArray = [
    getAlbum,
    getArtpiece,
    getMovie,
    getTVShow,
    getVideoGame,
  ];

  // >>>>>>>>>>>>>>>>>>>>> GENERATOR FUNCTIONS <<<<<<<<<<<<<<<<<<<<<
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

  // >>>>>>>>>>>>>>>>>>>>> 'CHECK AND SET' FUNCTIONS <<<<<<<<<<<<<<<<<<<<<
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
      bufferLength = tempBuffer.length;
      for (bufferLength; bufferLength < 3; bufferLength++) {
        let newMatchup = await generateMatchup();
        tempBuffer.push(newMatchup);
      }
    } else {
      tempBuffer.shift();
      setMatchup(bufferedMatchups[0]);
      let tempMatchup = await generateMatchup();
      tempBuffer.push(tempMatchup);
    }
    setBufferedMatchups(tempBuffer);
  };

  const checkAndSetDailyMatchups = async (): Promise<void> => {
    const tempUser = await getUserById(user!.uid);
    const tempUserIndex = tempUser.dailyMatchupsIndex;
    const tempUserDate = tempUser.dailyMatchupsDate;
    const dateInfo = generateDateInfo();
    const detailedDate = dateInfo.detailedDate;
    const simpleDate = dateInfo.simpleDate;
    let todaysCollection = await getDailyMatchupCollection(simpleDate);
    let tempDailyIsComplete = dailyIsComplete;
    console.log(tempUserDate);

    if (tempUserDate === todaysCollection.simpleDate) {
      if (tempUserIndex === 9) {
        tempDailyIsComplete = true;
        setDailyIsComplete(true);
      }
      todaysCollection.matchups.splice(0, tempUserIndex! + 1);
    }

    if (todaysCollection) {
      setDailyMatchups(todaysCollection.matchups);
      if (tempDailyIsComplete === false) {
        setMatchup(todaysCollection.matchups[0]);
      } else {
        checkAndSetBufferedMatchups();
      }
    } else {
      let tempCollection = await generateMultipleMatchups(10);
      tempCollection = tempCollection.map((item, i) => ({
        ...item,
        dailyMatchupsIndex: i,
        dailyMatchupsDate: simpleDate,
      }));
      let dailyMatchupCollection: any = {
        detailedDate: detailedDate,
        simpleDate: simpleDate,
        matchups: tempCollection,
      };
      postDailyMatchupCollection(dailyMatchupCollection);
      setDailyMatchups(tempCollection);
      setMatchup(tempCollection[0]);
    }
  };

  const checkAndSetMatchup = async () => {
    let tempDailyIsComplete = dailyIsComplete;
    if (matchup!.dailyMatchupsIndex) {
      if (dailyMatchups[0].dailyMatchupsIndex === 9) {
        tempDailyIsComplete = true;
        setDailyIsComplete(true);
        dailyMatchups?.shift();
      }
    }
    if (tempDailyIsComplete) {
      await checkAndSetBufferedMatchups();
    } else {
      dailyMatchups?.shift();
      setMatchup(dailyMatchups![0]);
    }
  };

  const submitUserMatchupHandler = async (
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
    matchup!.uid = user?.uid;
    matchup!.date = Date.now();
    matchup!.upvotes = 0;
    matchup!.downvotes = 0;
    submitMatchup(matchup!);

    if (dailyMatchups.length > 0) {
      let updatesObj = {
        dailyMatchupsDate: matchup!.dailyMatchupsDate!,
        dailyMatchupsIndex: matchup!.dailyMatchupsIndex!,
      };
      console.log(updatesObj);
      await updateUserDailiesByID(user!.uid as string, updatesObj);
    }
    console.log("Daily Matchups Status: ", dailyMatchups);
    checkAndSetMatchup();
  };

  const matchupCardJSX = (
    <MatchupCard matchup={matchup} onSubmitMatchup={submitUserMatchupHandler} />
  );

  const statsCardJSX = <StatsCard />;

  // This use effect gets the date; sets a detailed and simplified version, then checks to see if a daily 10 has been submitted for the day. If not, it creates one, and sets it for the user. If it has been, it retrieves and sets it for the user.
  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    if (!isInitialRender) {
      checkAndSetDailyMatchups();
    }
  }, [user]);

  //  Logs bufferedMatchups whenever the current matchup changes (to make sure the buffer is updating)
  useEffect(() => {
    if (!isInitialRender && bufferedMatchups.length > 0) {
      console.log("Current Matchup Buffer: ", bufferedMatchups);
    }
  }, [matchup]);

  // When dailyMatchups changes, this runs.
  useEffect(() => {
    // if (!isInitialRender && dailyMatchups.length === 10) {
    //   setMatchup(dailyMatchups![0]);
    // }
  }, [dailyMatchups]);

  return (
    <div className="Homepage">
      {user ? (
        <div>
          {matchupCardJSX}
          <button onClick={checkAndSetMatchup}>GENERATE NEW MATCHUP</button>
        </div>
      ) : (
        <div></div>
      )}
      <Footer />
    </div>
  );
};

export default Homepage;
