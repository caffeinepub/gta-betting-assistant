import type { RaceEntry } from '@/backend';

export function calculateImpliedProbability(odds: number): number {
  return (1 / (odds + 1)) * 100;
}

export function calculateTotalImpliedProbability(oddsArray: number[]): number {
  return oddsArray.reduce((sum, odds) => sum + calculateImpliedProbability(odds), 0);
}

export function calculateOverround(totalImplied: number): number {
  return totalImplied - 100;
}

export function calculateDashboardStats(raceHistory: RaceEntry[]) {
  let totalRaces = raceHistory.length;
  let totalBets = raceHistory.filter((r) => r.followedRecommendation).length;
  let totalProfit = 0;
  let correctPredictions = 0;
  let sessionProfit = 0;

  const sessionStart = raceHistory.length > 10 ? raceHistory.length - 10 : 0;

  raceHistory.forEach((race, idx) => {
    if (race.outcome && race.followedRecommendation) {
      const winner = Number(race.outcome.winner);
      const recommended = Number(race.modelPrediction);
      const betSize = Number(race.betSize);

      if (winner === recommended) {
        const profit = betSize * race.odds[recommended - 1];
        totalProfit += profit;
        correctPredictions++;

        if (idx >= sessionStart) {
          sessionProfit += profit;
        }
      } else {
        totalProfit -= betSize;
        if (idx >= sessionStart) {
          sessionProfit -= betSize;
        }
      }
    }
  });

  const accuracy = totalBets > 0 ? (correctPredictions / totalBets) * 100 : 0;
  const totalWagered = totalBets * 5000; // Approximate
  const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0;

  return {
    totalRaces,
    totalBets,
    totalProfit,
    roi,
    accuracy,
    sessionProfit,
  };
}
