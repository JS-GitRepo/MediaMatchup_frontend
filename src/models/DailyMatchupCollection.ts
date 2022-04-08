import Matchup from "./Matchup";

export default interface DailyMatchupCollection {
  _id: string;
  date: Date;
  matchups: Matchup[];
}
