import { useState, useEffect } from 'react';
import { useGetRaceHistory } from './useQueries';

export interface SessionSummaryData {
  raceCount: number;
  profitLoss: number;
  bestContender: number;
  worstContender: number;
  mostAccurateMode: string;
}

export function useSessionTracking() {
  const { data: raceHistory = [] } = useGetRaceHistory();
  const [lastCheckedCount, setLastCheckedCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<SessionSummaryData | null>(null);

  useEffect(() => {
    const currentCount = raceHistory.filter((r) => r.outcome).length;

    if (currentCount > 0 && currentCount !== lastCheckedCount) {
      if (currentCount % 10 === 0 && currentCount > lastCheckedCount) {
        // Calculate summary data
        const recentRaces = raceHistory.slice(-10);
        let totalProfit = 0;
        const contenderPerformance: Record<number, number> = {};

        recentRaces.forEach((race) => {
          if (race.outcome) {
            const winner = Number(race.outcome.winner);
            const recommended = Number(race.modelPrediction);
            const betSize = Number(race.betSize);

            if (winner === recommended) {
              totalProfit += betSize * race.odds[recommended - 1];
            } else {
              totalProfit -= betSize;
            }

            contenderPerformance[winner] = (contenderPerformance[winner] || 0) + 1;
          }
        });

        const sortedContenders = Object.entries(contenderPerformance).sort(
          ([, a], [, b]) => b - a
        );

        setSummaryData({
          raceCount: 10,
          profitLoss: totalProfit,
          bestContender: sortedContenders[0] ? parseInt(sortedContenders[0][0]) : 1,
          worstContender: sortedContenders[sortedContenders.length - 1]
            ? parseInt(sortedContenders[sortedContenders.length - 1][0])
            : 6,
          mostAccurateMode: 'Balanced',
        });

        setShowSummary(true);
      }

      setLastCheckedCount(currentCount);
    }
  }, [raceHistory, lastCheckedCount]);

  const dismissSummary = () => {
    setShowSummary(false);
  };

  return { showSummary, summaryData, dismissSummary };
}
