import { useEffect, useRef, useState } from "react";
import Matchup from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import "./MatchupCard.css";
import loading from "../images/loading.svg";

interface Props {
  matchup: Matchup;
  onSubmitMatchup: (winner: MediaItem, dailyMatchupIndex?: number) => void;
  checkAndSetMatchups: () => void;
}

const MatchupCard = ({
  matchup,
  onSubmitMatchup,
  checkAndSetMatchups,
}: Props) => {
  // Animation useStates
  const [media1Animation, setMedia1Animation] = useState(false);
  const [media2Animation, setMedia2Animation] = useState(false);
  const [crown1Animation, setCrown1Animation] = useState(false);
  const [crown2Animation, setCrown2Animation] = useState(false);
  // useStates for Matchup and associated Media
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [dailyIndex, setDailyIndex] = useState<number>(-1);
  const [mediaIsDefined, setMediaIsDefined] = useState<boolean>(false);
  const mediaDefinedCounter = useRef(0);
  //  useStates for media / matchup variable construction
  const [title1, setTitle1] = useState<string>();
  const [title2, setTitle2] = useState<string>();
  const [subtitle1, setSubtitle1] = useState<string>();
  const [subtitle2, setSubtitle2] = useState<string>();
  const [mainImg1, setMainImg1] = useState<string>();
  const [mainImg2, setMainImg2] = useState<string>();
  const [backgroundImg1, setBackgroundImg1] = useState<string>();
  const [backgroundImg2, setBackgroundImg2] = useState<string>();
  const [mediaCategory1, setMediaCategory1] = useState<string>();
  const [mediaCategory2, setMediaCategory2] = useState<string>();
  // Wait for all images to load before showing them
  const [loadingImages, setLoadingImages] = useState<string[]>([]);
  const [imagesAreLoaded, setImagesAreLoaded] = useState<boolean>(false);
  const imageLoadedCounter = useRef(0);

  const constructMedia = async () => {
    setTitle1(matchup.media1.title);
    setTitle2(matchup.media2.title);
    setSubtitle1(matchup.media1.subtitle);
    setSubtitle2(matchup.media2.subtitle);
    setMediaCategory1(matchup.media1.category);
    setMediaCategory2(matchup.media2.category);
    setMainImg1(matchup.media1.artImg);
    setMainImg2(matchup.media2.artImg);
    setBackgroundImg1(
      matchup.media1.artImg2 ? matchup.media1.artImg2 : matchup.media1.artImg
    );
    setBackgroundImg2(
      matchup.media2.artImg2 ? matchup.media2.artImg2 : matchup.media2.artImg
    );
    if (
      matchup.media1.category === "Video Game" ||
      matchup.media1.category === "Film" ||
      matchup.media1.category === "Television"
    ) {
      setSubtitle1(matchup.media1.subtitle.substring(0, 4));
    }
    if (
      matchup.media2.category === "Video Game" ||
      matchup.media2.category === "Film" ||
      matchup.media2.category === "Television"
    ) {
      setSubtitle2(matchup.media2.subtitle.substring(0, 4));
    }
  };

  const winnerAnimation = (
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

  const checkAndSetDailyIndex = () => {
    let tempDailyIndex = matchup?.dailyMatchupsIndex!;
    if (tempDailyIndex < 9 && tempDailyIndex >= 0) {
      setDailyIndex(tempDailyIndex);
      setShowGenerateButton(false);
    }
    if (dailyIndex >= 8) {
      setDailyIndex(dailyIndex + 1);
    }
    if (dailyIndex >= 12) {
      setShowGenerateButton(true);
    }
  };

  const imageLoaded = () => {
    console.log(loadingImages.length);
    imageLoadedCounter.current += 1;
    if (imageLoadedCounter.current >= loadingImages.length) {
      setImagesAreLoaded(true);
    }
  };

  const mediaDefined = () => {
    console.log(loadingImages.length);
    imageLoadedCounter.current += 1;
    if (imageLoadedCounter.current >= loadingImages.length) {
      setMediaIsDefined(true);
    }
  };

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

  let loadingContainerJSX = (
    <div className="loading-container">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    setImagesAreLoaded(false);
    if (!isInitialRender) {
      setLoadingImages([
        matchup.media1.artImg!,
        matchup.media2.artImg!,
        matchup.media1.artImg2!,
        matchup.media2.artImg2!,
      ]);
      checkAndSetDailyIndex();
      constructMedia();
    }
  }, [matchup]);

  useEffect(() => {}, [imagesAreLoaded]);

  return (
    <div className="MatchupCard">
      {dailyHeaderJSX}

      {showGenerateButton ? (
        <div onClick={checkAndSetMatchups} className="daily-header">
          <p>{`Generate New Matchup`}</p>
        </div>
      ) : (
        <div></div>
      )}

      <i
        className={`fa-solid fa-crown${
          crown1Animation ? " crownAnimation1" : ""
        }`}></i>
      <div
        className={`media1-container${media1Animation ? " test1" : ""}`}
        onClick={() =>
          winnerAnimation(1, matchup?.media1!, matchup?.dailyMatchupsIndex)
        }>
        <div className="image-subcontainer">
          <img
            className={`media1-main-img main-img`}
            src={imagesAreLoaded ? mainImg1 : loading}
            alt={`Main Image 1: ${title1}`}
            onLoad={imageLoaded}
          />
        </div>

        <div className={`text-subcontainer`}>
          <p className="media1-title">{title1}</p>
          <p className="media1-subtitle">{subtitle1}</p>
          <p className="media1-category">{`(${mediaCategory1})`}</p>
        </div>

        <img
          className={`media1-bg-img bg-img`}
          src={imagesAreLoaded ? backgroundImg1 : ""}
          alt={`Background Image 1: ${title1}`}
          onLoad={imageLoaded}
        />
      </div>
      <p className="vs">VS</p>
      <i
        className={`fa-solid fa-crown${
          crown2Animation ? " crownAnimation2" : ""
        }`}></i>
      <div
        className={`media2-container${media2Animation ? " test2" : ""}`}
        onClick={() =>
          winnerAnimation(2, matchup?.media1!, matchup?.dailyMatchupsIndex)
        }>
        <div className="image-subcontainer">
          <img
            className={`media2-main-img main-img`}
            src={imagesAreLoaded ? mainImg2 : loading}
            alt={`Main Image 2: ${mainImg2}`}
            onLoad={imageLoaded}
          />
        </div>
        <div className="text-subcontainer">
          <p className="media2-title">{title2}</p>
          <p className="media2-subtitle">{subtitle2}</p>
          <p className="media2-category">{`(${mediaCategory2})`}</p>
        </div>
        <img
          className={`media2-bg-img bg-img`}
          src={imagesAreLoaded ? backgroundImg2 : ""}
          alt={`Background Image 2: ${title2}`}
          onLoad={imageLoaded}
        />
      </div>
    </div>
  );
};

export default MatchupCard;
