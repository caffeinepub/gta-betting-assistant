import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import RaceHistoryEntry from '@/components/RaceHistoryEntry';
import { useGetRaceHistory } from '@/hooks/useQueries';
import { downloadAsJSON, downloadAsCSV } from '@/lib/export-utils';

export default function History() {
  const { data: raceHistory = [], isLoading } = useGetRaceHistory();

  const handleExportJSON = () => {
    downloadAsJSON(raceHistory, 'gta-betting-history.json');
  };

  const handleExportCSV = () => {
    downloadAsCSV(raceHistory, 'gta-betting-history.csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Race History</h2>
          <p className="text-muted-foreground">Complete log of all your races</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading history...</p>
          </CardContent>
        </Card>
      ) : raceHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No races logged yet. Start by creating a new bet!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {[...raceHistory].reverse().map((race, index) => (
            <RaceHistoryEntry
              key={raceHistory.length - 1 - index}
              race={race}
              index={raceHistory.length - 1 - index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
