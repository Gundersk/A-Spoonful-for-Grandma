import { ECONOMY } from './data.js';
export function rewardForVkcal(vkcal) {
  return Math.max(0, Math.round(vkcal * ECONOMY.coinsPerVkcal));
}
