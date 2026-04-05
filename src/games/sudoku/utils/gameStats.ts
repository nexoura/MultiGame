import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from './sudoku';

const STATS_KEY = 'sudoku_game_stats_v3';

/** Stars needed to advance one level */
export const STARS_PER_LEVEL = 20;

/**
 * Each selectable card in the UI has its own mode.
 * Fast & Easy both generate an 'easy' puzzle but track XP independently.
 */
export type DifficultyMode = 'fast' | 'easy' | 'medium' | 'hard' | 'expert';

/** All modes — used for forward-compat init */
export const ALL_MODES: DifficultyMode[] = ['fast', 'easy', 'medium', 'hard', 'expert'];

/** Maps a UI mode to the puzzle-generator difficulty */
export const modeToDifficulty: Record<DifficultyMode, Difficulty> = {
  fast:   'easy',
  easy:   'easy',
  medium: 'medium',
  hard:   'hard',
  expert: 'hard',
};

/* ─── Week helper ─── */
const getWeekKey = (date: Date = new Date()): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

/* ─── Types ─── */
export interface DifficultyStats {
  totalStars: number;   // cumulative XP stars
  gamesPlayed: number;
  gamesWon: number;
  lastStars: number;    // stars from the most recent game
}

export interface GameStats {
  totalPlayed: number;
  totalWon: number;
  streak: number;
  bestStreak: number;
  weeklyPlayed: number;
  weeklyWon: number;
  weekKey: string;
  /** Keyed by DifficultyMode so Fast and Easy are tracked separately */
  modes: Record<DifficultyMode, DifficultyStats>;
}

export interface LevelInfo {
  level: number;
  starsInLevel: number;  // stars earned within the current level
  progress: number;       // 0–1 fraction toward next level
  starsToNext: number;
  totalStars: number;
}

/* ─── Defaults ─── */
const defaultDiffStats = (): DifficultyStats => ({
  totalStars: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  lastStars: 0,
});

const makeDefaultModes = (): Record<DifficultyMode, DifficultyStats> => ({
  fast:   defaultDiffStats(),
  easy:   defaultDiffStats(),
  medium: defaultDiffStats(),
  hard:   defaultDiffStats(),
  expert: defaultDiffStats(),
});

const DEFAULT_STATS: GameStats = {
  totalPlayed: 0,
  totalWon: 0,
  streak: 0,
  bestStreak: 0,
  weeklyPlayed: 0,
  weeklyWon: 0,
  weekKey: getWeekKey(),
  modes: makeDefaultModes(),
};

/* ─── Core helpers ─── */

/**
 * Stars based on finish time:
 *   ≤ 2 min  → ⭐⭐⭐⭐⭐ (5)
 *   2–4 min  → ⭐⭐⭐⭐  (4)
 *   4–6 min  → ⭐⭐⭐   (3)
 *   6–8 min  → ⭐⭐    (2)
 *   > 8 min  → ⭐     (1)
 */
export const starsForTime = (seconds: number): number => {
  if (seconds <= 120) return 5;
  if (seconds <= 240) return 4;
  if (seconds <= 360) return 3;
  if (seconds <= 480) return 2;
  return 1;
};

/** Compute level, progress and stars-to-next from cumulative stars */
export const getLevelInfo = (totalStars: number): LevelInfo => {
  const level        = Math.floor(totalStars / STARS_PER_LEVEL) + 1;
  const starsInLevel = totalStars % STARS_PER_LEVEL;
  const progress     = starsInLevel / STARS_PER_LEVEL;
  const starsToNext  = STARS_PER_LEVEL - starsInLevel;
  return { level, starsInLevel, progress, starsToNext, totalStars };
};

/** Weekly win rate as 0–100 integer */
export const weeklyWinRate = (stats: GameStats): number => {
  if (stats.weeklyPlayed === 0) return 0;
  return Math.round((stats.weeklyWon / stats.weeklyPlayed) * 100);
};

/* ─── Persistence ─── */
export const loadStats = async (): Promise<GameStats> => {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS, modes: makeDefaultModes() };

    const data: GameStats = JSON.parse(raw);

    // Ensure `modes` map exists and all keys are present (forward-compat)
    if (!data.modes) {
      data.modes = makeDefaultModes();
    } else {
      ALL_MODES.forEach(m => {
        if (!data.modes[m]) data.modes[m] = defaultDiffStats();
      });
    }

    // Reset weekly counters on new week
    const currentWeek = getWeekKey();
    if (data.weekKey !== currentWeek) {
      data.weeklyPlayed = 0;
      data.weeklyWon    = 0;
      data.weekKey      = currentWeek;
    }

    return data;
  } catch {
    return { ...DEFAULT_STATS, modes: makeDefaultModes() };
  }
};

export const saveStats = async (stats: GameStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch { /* ignore */ }
};

/**
 * Record a finished game.
 * @param won   true if the player solved the puzzle
 * @param mode  the exact UI difficulty that was selected (e.g. 'fast', 'easy')
 * @param stars 1–5 stars from starsForTime(); 0 on game-over
 */
export const recordGameResult = async (
  won: boolean,
  mode: DifficultyMode,
  stars: number,
): Promise<GameStats> => {
  const stats = await loadStats();

  // Update only the specific mode's stats
  const modeStats = { ...stats.modes[mode] };
  modeStats.gamesPlayed += 1;
  modeStats.lastStars    = stars;
  if (won) {
    modeStats.gamesWon   += 1;
    modeStats.totalStars += stars;
  }

  const updated: GameStats = {
    ...stats,
    totalPlayed:  stats.totalPlayed + 1,
    totalWon:     stats.totalWon + (won ? 1 : 0),
    streak:       won ? stats.streak + 1 : 0,
    bestStreak:   won ? Math.max(stats.bestStreak, stats.streak + 1) : stats.bestStreak,
    weeklyPlayed: stats.weeklyPlayed + 1,
    weeklyWon:    stats.weeklyWon + (won ? 1 : 0),
    modes: { ...stats.modes, [mode]: modeStats },
  };

  await saveStats(updated);
  return updated;
};
