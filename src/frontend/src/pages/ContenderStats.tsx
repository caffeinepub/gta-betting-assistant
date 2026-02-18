import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContenderProfile from '@/components/ContenderProfile';
import { useGetRaceHistory } from '@/hooks/useQueries';
import { calculateContenderStats } from '@/lib/contender-calculations';

export default function ContenderStats() {
  const { data: raceHistory = [], isLoading } = useGetRaceHistory();

  const contenderStats = [1, 2, 3, 4, 5, 6].map((num) =>
    calculateContenderStats(num, raceHistory)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Contender Statistics</h2>
        <p className="text-muted-foreground">Performance profiles for each contender</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading statistics...</p>
          </CardContent>
        </Card>
      ) : raceHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No data available yet. Log some races to see statistics!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contenderStats.map((stats, index) => (
            <ContenderProfile key={index} contenderNumber={index + 1} stats={stats} />
          ))}
        </div>
      )}
    </div>
  );
}
