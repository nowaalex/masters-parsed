export const Leagues = [
  "Liga A",
  "Liga B",
  "Liga C",
  "Liga kobiet A",
  "Liga kobiet B",
  "Superliga",
] as const;

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
  league: (typeof Leagues)[number];
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
