// Stub for react-native-google-mobile-ads on web platform
// Ads are not supported on web; this prevents bundling errors.

const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
};

const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
  ERROR: 'error',
};

class RewardedAd {
  static createForAdRequest(_adUnitId, _options) {
    return new RewardedAd();
  }
  addAdEventListener(_event, _callback) {}
  load() {}
  show() {
    return Promise.resolve();
  }
}

module.exports = {
  TestIds,
  RewardedAdEventType,
  RewardedAd,
};
