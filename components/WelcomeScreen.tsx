import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Difficulty } from '@/utils/sudoku';
import {
  loadStats,
  weeklyWinRate,
  getLevelInfo,
  STARS_PER_LEVEL,
  GameStats,
  LevelInfo,
  DifficultyMode,
} from '@/utils/gameStats';

interface WelcomeScreenProps {
  onSelectDifficulty: (mode: DifficultyMode) => void;
}

interface DifficultyItem {
  label: string;
  value: Difficulty;      // for puzzle generation (unused here now)
  mode: DifficultyMode;   // unique tracking key — Fast ≠ Easy
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  bgColor: string;
  tagline: string;
}

const DIFFICULTIES: DifficultyItem[] = [
  {
    label: 'Fast',
    value: 'easy',
    mode: 'fast',
    icon: 'flash',
    accentColor: '#F59E0B',
    bgColor: '#FFFBEB',
    tagline: '~5 min  ·  Great quick game',
  },
  {
    label: 'Easy',
    value: 'easy',
    mode: 'easy',
    icon: 'sunny',
    accentColor: '#22C55E',
    bgColor: '#F0FDF4',
    tagline: 'Perfect for beginners',
  },
  {
    label: 'Medium',
    value: 'medium',
    mode: 'medium',
    icon: 'partly-sunny',
    accentColor: '#3B82F6',
    bgColor: '#EFF6FF',
    tagline: 'A satisfying challenge',
  },
  {
    label: 'Hard',
    value: 'hard',
    mode: 'hard',
    icon: 'thunderstorm',
    accentColor: '#EF4444',
    bgColor: '#FEF2F2',
    tagline: 'Requires real strategy',
  },
  {
    label: 'Expert',
    value: 'hard',
    mode: 'expert',
    icon: 'skull',
    accentColor: '#8B5CF6',
    bgColor: '#F5F3FF',
    tagline: 'Only for puzzle masters',
  },
];

/* ─── Stat box in hero ─── */
const StatBox = ({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) => (
  <View style={statStyles.box}>
    <Text style={[statStyles.value, { color }]}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

/* ─── Main screen ─── */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectDifficulty,
}) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const padH = isTablet ? Math.max((width - 540) / 2, 40) : 18;

  const [stats, setStats] = useState<GameStats | null>(null);

  /* entrance animations */
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    loadStats().then(setStats);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  const winRate  = stats ? weeklyWinRate(stats) : 0;
  const streak   = stats?.streak ?? 0;
  const played   = stats?.totalPlayed ?? 0;

  const winRateColor =
    stats && stats.weeklyPlayed > 0
      ? winRate >= 70 ? '#4ADE80' : winRate >= 40 ? '#FDE68A' : '#FCA5A5'
      : '#94A3B8';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <ScrollView
        contentContainerStyle={[styles.container, { paddingHorizontal: padH }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero banner ── */}
        <Animated.View
          style={[
            styles.hero,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* decorative blobs */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />
          <View style={styles.blob3} />

          {/* badge */}
          <View style={styles.heroBadge}>
            <Ionicons name="grid" size={12} color="#fff" />
            <Text style={styles.heroBadgeText}>SUDOKU</Text>
          </View>

          <Text style={styles.heroTitle}>New Game</Text>
          <Text style={styles.heroSub}>Train your mind daily</Text>

          {/* live stats */}
          <View style={styles.statsRow}>
            <StatBox
              value={
                stats && stats.weeklyPlayed > 0 ? `${winRate}%` : '—'
              }
              label="Weekly Win"
              color={winRateColor}
            />
            <View style={statStyles.divider} />
            <StatBox
              value={streak > 0 ? `${streak} 🔥` : `${streak}`}
              label="Win Streak"
              color={streak >= 3 ? '#FDE68A' : '#FFFFFF'}
            />
            <View style={statStyles.divider} />
            <StatBox value={String(played)} label="Played" color="#CBD5E1" />
          </View>
        </Animated.View>

        {/* ── Section label ── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionLabel}>Choose Difficulty</Text>
        </Animated.View>

        {/* ── Cards ── */}
        {DIFFICULTIES.map((d, i) => {
          // Use mode as the unique stats key — Fast and Easy are separate
          const ds       = stats?.modes[d.mode];
          const levelInfo: LevelInfo = getLevelInfo(ds?.totalStars ?? 0);
          const gamesWon = ds?.gamesWon ?? 0;

          return (
            <DiffCard
              key={d.mode}
              item={d}
              index={i}
              levelInfo={levelInfo}
              gamesWon={gamesWon}
              onPress={() => onSelectDifficulty(d.mode)}
            />
          );
        })}

        <Text style={styles.footer}>
          Every puzzle has exactly one solution  ✦
        </Text>
      </ScrollView>
    </View>
  );
};

/* ─── Animated Difficulty Card ─── */
interface DiffCardProps {
  item: DifficultyItem;
  index: number;
  levelInfo: LevelInfo;
  gamesWon: number;
  onPress: () => void;
}

const DiffCard: React.FC<DiffCardProps> = ({
  item,
  index,
  levelInfo,
  gamesWon,
  onPress,
}) => {
  const slideAnim = useRef(new Animated.Value(36)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  {
        toValue: 1, duration: 400, delay: 100 + index * 65, useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 400, delay: 100 + index * 65, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn  = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 35 }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 35 }).start();

  /* progress bar fill width as percentage string */
  const barPercent = `${Math.round(levelInfo.progress * 100)}%`;

  /* level badge is dark when level >= 5 */
  const badgeDark = levelInfo.level >= 5;

  return (
    <Animated.View
      style={{
        opacity:   fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        marginBottom: 11,
      }}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        {/* left accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: item.accentColor }]} />

        {/* icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
          <Ionicons name={item.icon} size={20} color={item.accentColor} />
        </View>

        {/* text block */}
        <View style={styles.cardBody}>
          {/* row: name + level badge */}
          <View style={styles.nameRow}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <View
              style={[
                styles.levelBadge,
                badgeDark ? styles.levelBadgeDark : styles.levelBadgeLight,
              ]}
            >
              <Text
                style={[
                  styles.levelText,
                  badgeDark ? styles.levelTextDark : styles.levelTextLight,
                ]}
              >
                Lv{levelInfo.level}
              </Text>
            </View>
          </View>

          <Text style={styles.cardTagline}>{item.tagline}</Text>

          {/* XP progress bar — only shown after at least one win */}
          {gamesWon > 0 && (
            <View style={styles.xpRow}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      flex: levelInfo.progress,
                      backgroundColor: item.accentColor,
                    },
                  ]}
                />
                {/* spacer for unfilled part */}
                <View style={{ flex: 1 - levelInfo.progress }} />
              </View>
              <Text style={[styles.xpLabel, { color: item.accentColor }]}>
                {levelInfo.starsInLevel}/{STARS_PER_LEVEL} ⭐
              </Text>
            </View>
          )}
        </View>

        {/* right chevron */}
        <Ionicons name="chevron-forward" size={17} color="#D1D5DB" />
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ─── Styles ─── */

const HERO = '#4F46E5';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F1F3FB',
  },
  container: {
    paddingTop: 0,
    paddingBottom: 44,
  },

  /* Hero */
  hero: {
    backgroundColor: HERO,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 26,
    marginBottom: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -50,
  },
  blob2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -40,
    left: -30,
  },
  blob3: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: 45,
    left: 70,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginBottom: 3,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    fontWeight: '500',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 6,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 2,
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 13,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E1B4B',
  },

  /* Level badge */
  levelBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  levelBadgeLight: {
    backgroundColor: '#F3F4F6',
  },
  levelBadgeDark: {
    backgroundColor: '#374151',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  levelTextLight: {
    color: '#9CA3AF',
  },
  levelTextDark: {
    color: '#FFFFFF',
  },

  cardTagline: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  /* XP progress */
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },
  progressBg: {
    flex: 1,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: '700',
    minWidth: 52,
    textAlign: 'right',
  },

  /* Footer */
  footer: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

const statStyles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
  },
});
