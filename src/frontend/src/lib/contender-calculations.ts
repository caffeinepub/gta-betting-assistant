import type { RaceEntry } from '@/backend';

export interface ContenderStats {
  totalRaces: number;
  winRate: number;
  placeRate: number;
  showRate: number;
  lastFiveFinishes: number[];
  streak: string;
  avgImpliedOdds: number;
  consistencyScore: number;
}

export function calculateContenderStats(
  contenderNumber: number,
  raceHistory: RaceEntry[]
): ContenderStats {
  const relevantRaces = raceHistory.filter((r) => r.outcome);
  const totalRaces = relevantRaces.length;

  if (totalRaces === 0) {
    return {
      totalRaces: 0,
      winRate: 0,
      placeRate: 0,
      showRate: 0,
      lastFiveFinishes: [],
      streak: 'N/A',
      avgImpliedOdds: 0,
      consistencyScore: 0,
    };
  }

  let wins = 0;
  let places = 0;
  let shows = 0;
  const finishes: number[] = [];
  let oddsSum = 0;

  relevantRaces.forEach((race) => {
    if (race.outcome) {
      const winner = Number(race.outcome.winner);
      const second = Number(race.outcome.secondPlace);
      const third = Number(race.outcome.thirdPlace);

      let position = 4;
      if (winner === contenderNumber) {
        wins++;
        position = 1;
      } else if (second === contenderNumber) {
        places++;
        position = 2;
      } else if (third === contenderNumber) {
        shows++;
        position = 3;
      }

      finishes.push(position);
      oddsSum += race.odds[contenderNumber - 1];
    }
  });

  const lastFiveFinishes = finishes.slice(-5);

  // Calculate streak
  let streak = 'None';
  if (finishes.length > 0) {
    const lastPosition = finishes[finishes.length - 1];
    let streakCount = 1;
    for (let i = finishes.length - 2; i >= 0; i--) {
      if (finishes[i] === lastPosition) {
        streakCount++;
      } else {
        break;
      }
    }
    if (streakCount > 1) {
      const positionName = lastPosition === 1 ? 'Win' : lastPosition === 2 ? 'Place' : lastPosition === 3 ? 'Show' : 'Miss';
      streak = `${streakCount} ${positionName}`;
    }
  }

  // Calculate consistency score (lower variance = higher consistency)
  const avgPosition = finishes.reduce((sum, pos) => sum + pos, 0) / finishes.length;
  const variance = finishes.reduce((sum, pos) => sum + Math.pow(pos - avgPosition, 2), 0) / finishes.length;
  const consistencyScore = Math.max(0, 1 - variance / 4); // Normalize to 0-1

  return {
    totalRaces,
    winRate: (wins / totalRaces) * 100,
    placeRate: (places / totalRaces) * 100,
    showRate: (shows / totalRaces) * 100,
    lastFiveFinishes,
    streak,
    avgImpliedOdds: (oddsSum / totalRaces / (oddsSum / totalRaces + 1)) * 100,
    consistencyScore,
  };
}
