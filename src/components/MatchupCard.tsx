import MediaItem from "../models/MediaItem";
import "./MatchupCard.css";

interface Props {
  match1: MediaItem;
  match2: MediaItem;
}

const MatchupCard = ({ match1, match2 }: Props) => {
  let backgroundImg1 = match1.artImg2 ? match1.artImg2 : match1.artImg;
  let backgroundImg2 = match2.artImg2 ? match2.artImg2 : match2.artImg;
  return (
    <div className="MatchupCard">
      <div className="match1-container">
        <img src={match1.artImg} alt={match1.title} />
        <p className="match1-title">{match1.title}</p>
        <p className="match1-subtitle">{match1.subtitle}</p>
        <img src={backgroundImg1} alt={match1.title} />
      </div>
      <p className="vs">VS</p>
      <div className="match2-container">
        <img src={match2.artImg} alt={match2.title} />
        <p className="match2-title">{match2.title}</p>
        <p className="match2-subtitle">{match2.subtitle}</p>
        <img src={backgroundImg2} alt={match2.title} />
      </div>
    </div>
  );
};

export default MatchupCard;
