export interface Match {
  time: string;
  rival: string;
  setsWon: number;
  setsLost: number;
  forfeit: boolean;
  final: boolean;
}

interface MatchesEntryBase {
  name: string;
  league: string;
  timeStamp: number;
  data: [string, Match[]][];
  error: string;
}

export interface MatchesEntryFrontend extends MatchesEntryBase {
  queueSize: number;
}

export interface MatchesEntryBackend extends MatchesEntryBase {
  isPending: boolean;
}
