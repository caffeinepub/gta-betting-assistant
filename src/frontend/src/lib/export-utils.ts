import type { RaceEntry } from '@/backend';

export function downloadAsJSON(data: RaceEntry[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(data: RaceEntry[], filename: string) {
  const headers = [
    'Timestamp',
    'Recommended',
    'Bet Size',
    'Winner',
    'Second',
    'Third',
    'Odds 1',
    'Odds 2',
    'Odds 3',
    'Odds 4',
    'Odds 5',
    'Odds 6',
    'Followed',
  ];

  const rows = data.map((race) => [
    new Date(Number(race.timestamp) / 1000000).toISOString(),
    race.modelPrediction.toString(),
    race.betSize.toString(),
    race.outcome ? race.outcome.winner.toString() : '',
    race.outcome ? race.outcome.secondPlace.toString() : '',
    race.outcome ? race.outcome.thirdPlace.toString() : '',
    ...race.odds.map((o) => o.toString()),
    race.followedRecommendation.toString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
