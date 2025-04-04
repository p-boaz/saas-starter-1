/**
 * Core MLB Type Definitions
 *
 * This file contains core type definitions used throughout the MLB module.
 */

/**
 * Handedness enum for batters and pitchers
 */
export type Handedness = "L" | "R" | "S";

/**
 * Game state values
 */
export type GameState = "Preview" | "Live" | "Final";

/**
 * Team statistics for both hitting and pitching
 */
export interface TeamStats {
  hitting: Record<string, any>;
  pitching: Record<string, any>;
}

/**
 * Common metadata interface for cached data
 */
export interface ApiSourceMetadata {
  sourceTimestamp?: Date;
}

/**
 * Tracking information for data analysis
 */
export interface AnalysisMetadata {
  confidence: number; // 0-100
  analysisTimestamp: Date;
  dataVersion: string;
  factors: string[];
}

/**
 * Date range for data queries
 */
export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

import { z } from "zod";

// Weather-related schemas
export const MLBWeatherDataSchema = z.object({
  condition: z.string(),
  temp: z.string(), // MLB API returns temperature as string
  wind: z.string(),
  sourceTimestamp: z.date().optional(),
});

export type MLBWeatherData = z.infer<typeof MLBWeatherDataSchema>;

export interface DetailedWeatherInfo {
  temperature: number;
  condition: string;
  wind: {
    speed: number;
    direction: string;
    isCalm: boolean;
  };
  isOutdoor: boolean;
  isPrecipitation: boolean;
}

export interface GameFeedResponse {
  gamePk: number;
  gameData?: {
    status?: {
      abstractGameState?: string;
      detailedState?: string;
      codedGameState?: string;
    };
    teams?: {
      away?: {
        team?: {
          id: number;
          name: string;
        };
      };
      home?: {
        team?: {
          id: number;
          name: string;
        };
      };
    };
    weather?: {
      temp?: number;
      wind?: string;
      humidity?: number;
      pressure?: number;
      condition?: string;
    };
    venue?: {
      id?: number;
      name?: string;
      roofType?: string;
      roofStatus?: string;
    };
  };
  liveData?: {
    plays?: any;
    boxscore?: any;
    linescore?: any;
  };
  sourceTimestamp?: Date;
}

export interface GameBoxScoreResponse {
  teams: {
    away: {
      team: { name: string };
      teamStats?: any;
      players?: Record<string, any>;
    };
    home: {
      team: { name: string };
      teamStats?: any;
      players?: Record<string, any>;
    };
  };
  officials?: Array<any>;
  info?: Array<any>;
  pitchingNotes?: Array<any>;
}

export const GameScheduleSchema = z.array(
  z.object({
    gamePk: z.number(),
    gameDate: z.string(), // UTC timestamp of game start time
    officialDate: z.string().optional(), // Official MLB game date (may differ from gameDate due to timezone)
    teams: z.object({
      away: z
        .object({
          team: z
            .object({
              id: z.number(),
              name: z.string(),
            })
            .optional(),
          probablePitcher: z
            .object({
              id: z.number(),
              fullName: z.string(),
            })
            .optional(),
        })
        .optional(),
      home: z
        .object({
          team: z
            .object({
              id: z.number(),
              name: z.string(),
            })
            .optional(),
          probablePitcher: z
            .object({
              id: z.number(),
              fullName: z.string(),
            })
            .optional(),
        })
        .optional(),
    }),
    venue: z.object({
      id: z.number().optional(),
      name: z.string().optional(),
    }),
    status: z.object({
      abstractGameState: z.string().optional(),
      detailedState: z.string().optional(),
      statusCode: z.string().optional(),
    }),
  })
);

export type GameSchedule = z.infer<typeof GameScheduleSchema>;

export interface MLBScheduleResponse {
  dates: Array<{
    date: string;
    games: Array<{
      gamePk: number;
      gameDate: string;
      status: {
        abstractGameState?: string;
        detailedState?: string;
        statusCode?: string;
      };
      teams: {
        away: {
          team: {
            id: number;
            name: string;
          };
          probablePitcher?: {
            id: number;
            fullName: string;
          };
        };
        home: {
          team: {
            id: number;
            name: string;
          };
          probablePitcher?: {
            id: number;
            fullName: string;
          };
        };
      };
      venue: {
        id: number;
        name: string;
      };
    }>;
  }>;
}

// Player Stats Schemas
export interface PlayerStats {
  id: number;
  fullName: string;
  currentTeam: string;
  primaryPosition: string;
  batSide: string;
  pitchHand: string;
  seasonStats: {
    gamesPlayed: number;
    // Batting stats
    atBats: number;
    hits: number;
    homeRuns: number;
    rbi: number;
    avg: number;
    obp: number;
    slg: number;
    ops: number;
    wOBAvsL?: number;
    wOBAvsR?: number;
    last30wOBA?: number;
    // Pitching stats
    era?: number;
    whip?: number;
    wins?: number;
    losses?: number;
    saves?: number;
    inningsPitched?: number;
    strikeouts?: number;
    walks?: number;
  };
  careerStats: Array<{
    season: string;
    team: string;
    gamesPlayed: number;
    // Batting stats
    atBats: number;
    hits: number;
    homeRuns: number;
    rbi: number;
    avg: number;
    obp: number;
    slg: number;
    ops: number;
    // Pitching stats
    era?: number;
    whip?: number;
    wins?: number;
    losses?: number;
    saves?: number;
    inningsPitched?: number;
    strikeouts?: number;
    walks?: number;
  }>;
  // Metadata
  sourceTimestamp?: Date;
}

export interface PlayerGameStats {
  gamePk: number;
  date: string;
  batting?: {
    hits: number;
    atBats: number;
    runs: number;
    rbi: number;
    homeRuns: number;
    strikeouts: number;
    walks: number;
    stolenBases: number;
  };
  pitching?: {
    inningsPitched: number;
    hits: number;
    runs: number;
    earnedRuns: number;
    walks: number;
    strikeouts: number;
    homeRuns: number;
    pitchCount: number;
  };
}

export interface TeamStats {
  hitting: Record<string, any>;
  pitching: Record<string, any>;
}

export interface GameEnvironmentData {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: boolean;
  isOutdoor: boolean;
  humidityPercent?: number;
  pressureMb?: number;
  venueId?: number;
  venueName?: string;
  hasRoof?: boolean;
  roofStatus?: string;
  // Metadata for source tracking
  sourceTimestamp?: Date;
}

export interface ProbableLineup {
  away: number[];
  home: number[];
  awayBatters?: Array<{
    id: number;
    fullName: string;
    position: string;
  }>;
  homeBatters?: Array<{
    id: number;
    fullName: string;
    position: string;
  }>;
  confirmed?: boolean;
  confidence?: number; // 0-100 confidence score for predicted lineups
  sourceTimestamp?: Date;
}

export interface BallparkFactors {
  overall: number;
  handedness: {
    rHB: number;
    lHB: number;
  };
  types: {
    singles: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    runs: number;
  };
  venueId?: number;
  season?: string;
  sourceTimestamp?: Date;
}

export interface PitcherBatterMatchup {
  pitcher: {
    id: number;
    name: string;
    throwsHand: string;
  };
  batter: {
    id: number;
    name: string;
    batsHand: string;
  };
  stats: {
    atBats: number;
    hits: number;
    homeRuns: number;
    strikeouts: number;
    walks: number;
    avg: number;
    obp: number;
    slg: number;
    ops: number;
    totalPitches?: number;
    timing?: string;
  };
  sourceTimestamp?: Date;
}

export interface PitcherPitchMixData {
  playerId: number;
  name: string;
  pitches: {
    fastball: number; // percentage
    slider: number;
    curve: number;
    changeup: number;
    sinker: number;
    cutter: number;
    other: number;
  };
  averageVelocity: {
    fastball?: number;
    slider?: number;
    curve?: number;
    changeup?: number;
    sinker?: number;
    cutter?: number;
  };
  effectiveness: {
    fastball?: number; // scale 0-100
    slider?: number;
    curve?: number;
    changeup?: number;
    sinker?: number;
    cutter?: number;
  };
  controlMetrics: {
    zonePercentage: number;
    firstPitchStrikePercent: number;
    swingingStrikePercent: number;
    chaseRate: number;
  };
  velocityTrends?: {
    recentGames: {
      date: string;
      avgVelocity: number;
      change: number;
    }[];
    seasonAvg: number;
    recent15DayAvg: number;
    velocityChange: number;
  };
  sourceTimestamp?: Date;
}

export interface BatterPlateDiscipline {
  playerId: number;
  name: string;
  discipline: {
    chaseRate: number | null; // Swing % on pitches outside zone
    contactRate: number | null; // Contact % on all swings
    zoneSwingRate: number | null; // Swing % on pitches in zone
    whiffRate: number | null; // Miss % on all swings
    firstPitchSwingRate: number | null;
  };
  pitchTypePerformance: {
    vsFastball: number | null; // Performance score 0-100
    vsBreakingBall: number | null;
    vsOffspeed: number | null;
  };
  sourceTimestamp?: Date;
}

export interface MLBGame {
  gamePk: number;
  gameDate: string;
  status: {
    abstractGameState?: string;
    detailedState?: string;
    statusCode?: string;
  };
  teams: {
    away: {
      team: {
        id: number;
        name: string;
      };
      probablePitcher?: {
        id: number;
        fullName: string;
      };
    };
    home: {
      team: {
        id: number;
        name: string;
      };
      probablePitcher?: {
        id: number;
        fullName: string;
      };
    };
  };
  venue: {
    id: number;
    name: string;
  };
  lineups?: {
    away: number[];
    home: number[];
    awayBatters?: Array<{
      id: number;
      fullName: string;
      position: string;
    }>;
    homeBatters?: Array<{
      id: number;
      fullName: string;
      position: string;
    }>;
  };
  pitchers?: {
    away?: {
      id: number;
      fullName: string;
      throwsHand?: string;
    };
    home?: {
      id: number;
      fullName: string;
      throwsHand?: string;
    };
  };
  environment?: {
    temperature: number;
    windSpeed: number;
    windDirection: string;
    isOutdoor: boolean;
  };
}

export interface DailyMLBData {
  date: string;
  games: Array<{
    gameId: number;
    gameTime: string;
    status: {
      abstractGameState?: string;
      detailedState?: string;
      statusCode?: string;
    };
    homeTeam: {
      id: number;
      name: string;
    };
    awayTeam: {
      id: number;
      name: string;
    };
    venue: {
      id: number;
      name: string;
    };
    lineups?: {
      away: number[];
      home: number[];
      awayBatters?: Array<{
        id: number;
        fullName: string;
        position: string;
      }>;
      homeBatters?: Array<{
        id: number;
        fullName: string;
        position: string;
      }>;
    };
    pitchers?: {
      away?: {
        id: number;
        fullName: string;
        throwsHand?: string;
      };
      home?: {
        id: number;
        fullName: string;
        throwsHand?: string;
      };
    };
    environment?: {
      temperature: number;
      windSpeed: number;
      windDirection: string;
      isOutdoor: boolean;
    };
    teamStats: {
      home: TeamStats;
      away: TeamStats;
    };
    ballpark: BallparkFactors;
  }>;
  count: number;
  collectTimestamp: Date;
  seasons: string[];
}
