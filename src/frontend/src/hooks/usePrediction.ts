import { useState } from 'react';
import { useGetRaceHistory, useGetModelStats, useGetUserSettings, useLogRaceEntry } from './useQueries';
import { calculateImpliedProbability } from '@/lib/betting-calculations';
import { calculateContenderStats } from '@/lib/contender-calculations';

export interface PredictionResult {
  recommendedContender: number;
  predictedProbability: number;
  impliedProbability: number;
  edge: number;
  confidenceLevel: string;
  betSize: number;
  shouldSkip: boolean;
  signals: Array<{ name: string; score: number }>;
  weights: Record<string, number>;
  warnings: Array<'lowConfidence' | 'highVariance' | 'noValue'>;
}

export function usePrediction() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: raceHistory = [] } = useGetRaceHistory();
  const { data: modelStats } = useGetModelStats();
  const { data: settings } = useGetUserSettings();
  const logRaceEntry = useLogRaceEntry();

  const calculate = async (odds: number[], strategyMode: string) => {
    setIsCalculating(true);

    try {
      // Calculate implied probabilities
      const impliedProbs = odds.map(calculateImpliedProbability);

      // Calculate contender stats
      const contenderStats = [1, 2, 3, 4, 5, 6].map((num) =>
        calculateContenderStats(num, raceHistory)
      );

      // Define feature weights (these would be updated by the learning system)
      const weights = {
        'Market Odds': 0.30,
        'Historical Performance': 0.25,
        'Recent Form': 0.25,
        'Consistency': 0.20,
      };

      // Calculate signals for each contender
      const contenderScores = odds.map((odd, idx) => {
        const stats = contenderStats[idx];
        const impliedProb = impliedProbs[idx];

        // Market odds signal (lower implied prob = higher value)
        const marketSignal = (100 - impliedProb) / 100;

        // Historical performance signal
        const historicalSignal = stats.winRate / 100;

        // Recent form signal (based on last 5 finishes)
        const recentFormSignal = stats.lastFiveFinishes.filter((f) => f <= 3).length / 5;

        // Consistency signal (higher is better)
        const consistencySignal = stats.consistencyScore;

        // Weighted score
        const totalScore =
          marketSignal * weights['Market Odds'] +
          historicalSignal * weights['Historical Performance'] +
          recentFormSignal * weights['Recent Form'] +
          consistencySignal * weights['Consistency'];

        return {
          contender: idx + 1,
          score: totalScore,
          impliedProb,
          signals: {
            marketSignal,
            historicalSignal,
            recentFormSignal,
            consistencySignal,
          },
          variance: 1 - stats.consistencyScore,
        };
      });

      // Apply strategy mode
      let bestContender;
      switch (strategyMode) {
        case 'Safe':
          // Choose highest probability
          bestContender = contenderScores.reduce((best, curr) =>
            curr.score > best.score ? curr : best
          );
          break;
        case 'Value':
          // Choose best value (score vs implied prob)
          bestContender = contenderScores.reduce((best, curr) => {
            const currValue = curr.score - curr.impliedProb / 100;
            const bestValue = best.score - best.impliedProb / 100;
            return currValue > bestValue ? curr : best;
          });
          break;
        case 'Aggressive':
          // Choose high odds with decent score
          bestContender = contenderScores
            .filter((c) => c.score > 0.3)
            .reduce((best, curr) => (curr.impliedProb < best.impliedProb ? curr : best), contenderScores[0]);
          break;
        default: // Balanced
          bestContender = contenderScores.reduce((best, curr) =>
            curr.score > best.score ? curr : best
          );
      }

      const predictedProb = bestContender.score * 100;
      const edge = predictedProb - bestContender.impliedProb;

      // Determine confidence level
      let confidenceLevel = 'Medium';
      const modelConfidence = modelStats?.confidenceLevel || 'Medium';
      if (modelConfidence === 'Low' || bestContender.variance > 0.7) {
        confidenceLevel = 'Low';
      } else if (edge > 15 && bestContender.variance < 0.3) {
        confidenceLevel = 'High';
      }

      // Calculate bet size
      let betSize = 5000; // Base bet
      if (settings?.autoBetSizing) {
        if (confidenceLevel === 'High') betSize = 8000;
        if (confidenceLevel === 'Low') betSize = 2000;
        if (edge > 20) betSize = Math.min(betSize + 2000, 10000);
      }
      betSize = Math.max(1000, Math.min(10000, Math.round(betSize / 1000) * 1000));

      // Check if should skip - ensure it's always a boolean
      const doNotBetMode = settings?.doNotBetMode ?? true;
      const shouldSkip = doNotBetMode && edge < 5;

      // Collect warnings
      const warnings: Array<'lowConfidence' | 'highVariance' | 'noValue'> = [];
      if (confidenceLevel === 'Low') warnings.push('lowConfidence');
      if (bestContender.variance > 0.7) warnings.push('highVariance');
      if (edge < 5) warnings.push('noValue');

      const result: PredictionResult = {
        recommendedContender: bestContender.contender,
        predictedProbability: predictedProb,
        impliedProbability: bestContender.impliedProb,
        edge,
        confidenceLevel,
        betSize,
        shouldSkip,
        signals: [
          { name: 'Market Odds', score: bestContender.signals.marketSignal },
          { name: 'Historical Performance', score: bestContender.signals.historicalSignal },
          { name: 'Recent Form', score: bestContender.signals.recentFormSignal },
          { name: 'Consistency', score: bestContender.signals.consistencySignal },
        ],
        weights,
        warnings,
      };

      setPrediction(result);

      // Log the race entry
      if (!shouldSkip) {
        await logRaceEntry.mutateAsync({
          odds,
          modelPrediction: BigInt(bestContender.contender),
          betSize: BigInt(betSize),
          followedRecommendation: true,
        });
      }
    } finally {
      setIsCalculating(false);
    }
  };

  return { prediction, isCalculating, calculate };
}
