import { useEffect, useState } from "react";
import Matchup from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import "./MatchupCard.css";

interface Props {
  matchup: Matchup | undefined;
  onSubmitMatchup: (winner: MediaItem, dailyMatchupIndex?: number) => void;
}

const MatchupCard = ({ matchup, onSubmitMatchup }: Props) => {
  const [media1Animation, setMedia1Animation] = useState(false);
  const [media2Animation, setMedia2Animation] = useState(false);
  const [crown1Animation, setCrown1Animation] = useState(false);
  const [crown2Animation, setCrown2Animation] = useState(false);
  const [dailyIndex, setDailyIndex] = useState<number>(-1);
  let subtitle1 = matchup?.media1.subtitle;
  let subtitle2 = matchup?.media2.subtitle;
  let backgroundImg1 = matchup?.media1.artImg2
    ? matchup.media1.artImg2
    : matchup?.media1.artImg;
  let backgroundImg2 = matchup?.media2.artImg2
    ? matchup?.media2.artImg2
    : matchup?.media2.artImg;
  if (
    matchup?.media1.category === "Video Game" ||
    matchup?.media1.category === "Film" ||
    matchup?.media1.category === "Television"
  ) {
    subtitle1 = matchup?.media1.subtitle.substring(0, 4);
  }
  if (
    matchup?.media2.category === "Video Game" ||
    matchup?.media2.category === "Film" ||
    matchup?.media2.category === "Television"
  ) {
    subtitle2 = matchup?.media2.subtitle.substring(0, 4);
  }

  const test = (
    whichMedia: number,
    winner: MediaItem,
    dailyMatchupIndex?: number
  ) => {
    if (whichMedia === 1) {
      setMedia1Animation(true);
      setTimeout(() => setMedia1Animation(false), 500);
      setCrown1Animation(true);
      setTimeout(() => setCrown1Animation(false), 500);
    } else {
      setMedia2Animation(true);
      setTimeout(() => setMedia2Animation(false), 500);
      setCrown2Animation(true);
      setTimeout(() => setCrown2Animation(false), 500);
    }
    setTimeout(() => onSubmitMatchup(winner, dailyMatchupIndex), 120);
  };

  useEffect(() => {
    let tempDailyIndex = matchup?.dailyMatchupsIndex!;
    if (tempDailyIndex < 9 && tempDailyIndex >= 0) {
      setDailyIndex(tempDailyIndex);
    }
    if (dailyIndex >= 8) {
      setDailyIndex(dailyIndex + 1);
    }
  }, [matchup]);

  let dailyHeaderJSX = <div></div>;
  if (dailyIndex <= 9 && dailyIndex >= 0) {
    dailyHeaderJSX = (
      <div className="daily-header">
        <p>{`Daily Matchup: ${dailyIndex + 1}`}</p>
      </div>
    );
  } else if (dailyIndex > 9 && dailyIndex < 13) {
    dailyHeaderJSX = (
      <div className="daily-header">
        <p>{`Daily Matchups Complete!`}</p>
      </div>
    );
  } else {
    <div></div>;
  }

  return (
    <div className="MatchupCard">
      {dailyHeaderJSX}
      <i
        className={`fa-solid fa-crown${
          crown1Animation ? " crownAnimation1" : ""
        }`}
      ></i>
      <div
        className={`media1-container${media1Animation ? " test1" : ""}`}
        onClick={() => test(1, matchup?.media1!, matchup?.dailyMatchupsIndex)}
      >
        <div className="image-subcontainer">
          <img
            className="media1-main-img main-img"
            src={matchup?.media1.artImg}
            alt={`Main Image 1: ${matchup?.media1.title}`}
          />
        </div>
        <div className="text-subcontainer">
          <p className="media1-title">{matchup?.media1.title}</p>
          <p className="media1-subtitle">{subtitle1}</p>
          <p className="media1-category">{`(${matchup?.media1.category})`}</p>
        </div>
        <img
          className="media1-bg-img bg-img"
          src={backgroundImg1}
          alt={`Background Image 1: ${matchup?.media1.title}`}
        />
      </div>

      <p className="vs">VS</p>

      <i
        className={`fa-solid fa-crown${
          crown2Animation ? " crownAnimation2" : ""
        }`}
      ></i>
      <div
        className={`media2-container${media2Animation ? " test2" : ""}`}
        onClick={() => test(2, matchup?.media1!, matchup?.dailyMatchupsIndex)}
      >
        <div className="image-subcontainer">
          <img
            className="media2-main-img main-img"
            src={matchup?.media2.artImg}
            alt={`Main Image 2: ${matchup?.media2.title}`}
          />
        </div>
        <div className="text-subcontainer">
          <p className="media2-title">{matchup?.media2.title}</p>
          <p className="media2-subtitle">{subtitle2}</p>
          <p className="media2-category">{`(${matchup?.media2.category})`}</p>
        </div>
        <img
          className="media2-bg-img bg-img"
          src={backgroundImg2}
          alt={`Background Image 2: ${matchup?.media2.title}`}
        />
      </div>
    </div>
  );
};

export default MatchupCard;
