import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const HINTS_KEY = 'sudoku_hints';
const FREE_HINTS_PER_DAY = 1;

interface HintData {
  date: string;       // 'YYYY-MM-DD'
  freeUsed: number;   // how many free hints used today
  bonusHints: number; // extra hints earned from watching ads
}

const todayString = () => new Date().toISOString().split('T')[0];

const loadHintData = async (): Promise<HintData> => {
  try {
    const raw = await AsyncStorage.getItem(HINTS_KEY);
    if (!raw) return { date: todayString(), freeUsed: 0, bonusHints: 0 };
    const data: HintData = JSON.parse(raw);
    // Reset free hints if it's a new day
    if (data.date !== todayString()) {
      return { date: todayString(), freeUsed: 0, bonusHints: data.bonusHints };
    }
    return data;
  } catch {
    return { date: todayString(), freeUsed: 0, bonusHints: 0 };
  }
};

const saveHintData = async (data: HintData) => {
  await AsyncStorage.setItem(HINTS_KEY, JSON.stringify(data));
};

export const useHints = () => {
  const [hintData, setHintData] = useState<HintData>({ date: todayString(), freeUsed: 0, bonusHints: 0 });
  const [adLoaded, setAdLoaded] = useState(false);
  const [adLoading, setAdLoading] = useState(false);

  useEffect(() => {
    loadHintData().then(setHintData);
    loadRewardedAd();
  }, []);

  // Free hints left today
  const freeHintsLeft = Math.max(0, FREE_HINTS_PER_DAY - hintData.freeUsed);
  // Total hints available (free + bonus)
  const totalHintsLeft = freeHintsLeft + hintData.bonusHints;
  const needsAd = freeHintsLeft === 0 && hintData.bonusHints === 0;

  const loadRewardedAd = useCallback(async () => {
    setAdLoading(true);
    try {
      // react-native-google-mobile-ads requires a native build (EAS/Android Studio)
      // In Expo Go / Web, we simulate the ad loading
      const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

      if (Platform.OS === 'web' || isExpoGo) {
        // Simulated: ads cannot run in browser or Expo Go
        setTimeout(() => {
          setAdLoaded(true);
          setAdLoading(false);
        }, 800);
        return;
      }

      try {
        const { RewardedAd, RewardedAdEventType, TestIds } = await import('react-native-google-mobile-ads');
        // Use test ad unit ID for development, replace with real ID for production
        const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
        const rewarded = RewardedAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });

        rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
          setAdLoaded(true);
          setAdLoading(false);
        });

        rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
          // User watched the full ad — grant a bonus hint
          const updated = { ...hintData, bonusHints: hintData.bonusHints + 1 };
          setHintData(updated);
          await saveHintData(updated);
          loadRewardedAd(); // Pre-load the next ad
        });

        rewarded.load();
      } catch {
        // Native module not available (Expo Go) — use simulation
        setAdLoaded(true);
        setAdLoading(false);
      }
    } catch {
      setAdLoaded(true);
      setAdLoading(false);
    }
  }, [hintData]);

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    if (!adLoaded) {
      alert('Ad is still loading, please wait a moment...');
      return false;
    }

    try {
      const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

      if (Platform.OS === 'web' || isExpoGo) {
        // Simulation: auto-grant the reward
        const updated = { ...hintData, bonusHints: hintData.bonusHints + 1 };
        setHintData(updated);
        await saveHintData(updated);
        setAdLoaded(false);
        loadRewardedAd();
        return true;
      }

      try {
        const { RewardedAd, TestIds } = await import('react-native-google-mobile-ads');
        const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
        const rewarded = RewardedAd.createForAdRequest(adUnitId);
        setAdLoaded(false);
        await rewarded.show();
        return true;
      } catch {
        // Fallback: grant hint directly in dev/Expo Go
        const updated = { ...hintData, bonusHints: hintData.bonusHints + 1 };
        setHintData(updated);
        await saveHintData(updated);
        return true;
      }
    } catch {
      return false;
    }
  }, [adLoaded, hintData, loadRewardedAd]);

  const useHint = useCallback(async (): Promise<boolean> => {
    const fresh = await loadHintData();

    if (fresh.freeUsed < FREE_HINTS_PER_DAY) {
      // Use free hint
      const updated = { ...fresh, freeUsed: fresh.freeUsed + 1 };
      setHintData(updated);
      await saveHintData(updated);
      return true;
    } else if (fresh.bonusHints > 0) {
      // Use bonus hint (earned from ad)
      const updated = { ...fresh, bonusHints: fresh.bonusHints - 1 };
      setHintData(updated);
      await saveHintData(updated);
      return true;
    }

    // No hints available
    return false;
  }, []);

  return {
    freeHintsLeft,
    totalHintsLeft,
    needsAd,
    adLoaded,
    adLoading,
    useHint,
    showRewardedAd,
  };
};
