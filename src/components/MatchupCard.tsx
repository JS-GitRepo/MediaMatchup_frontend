import Matchup from "../models/Matchup";
import "./MatchupCard.css";

interface Props {
  matchup: Matchup | undefined;
}

const MatchupCard = ({ matchup }: Props) => {
  let backgroundImg1 = matchup?.media1.artImg2
    ? matchup.media1.artImg2
    : matchup?.media1.artImg;
  let backgroundImg2 = matchup?.media2.artImg2
    ? matchup?.media2.artImg2
    : matchup?.media2.artImg;
  return (
    <div className="MatchupCard">
      <div className="media1-container">
        <img src={matchup?.media1.artImg} alt={matchup?.media1.title} />
        <p className="media1-title">{matchup?.media1.title}</p>
        <p className="media1-subtitle">{matchup?.media1.subtitle}</p>
        <img src={backgroundImg1} alt={matchup?.media1.title} />
      </div>
      <p className="vs">VS</p>
      <div className="media2-container">
        <img src={matchup?.media2.artImg} alt={matchup?.media2.title} />
        <p className="media2-title">{matchup?.media2.title}</p>
        <p className="media2-subtitle">{matchup?.media2.subtitle}</p>
        <img src={backgroundImg2} alt={matchup?.media2.title} />
      </div>
    </div>
  );
};

export default MatchupCard;
