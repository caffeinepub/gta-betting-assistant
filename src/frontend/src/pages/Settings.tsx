import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGetUserSettings, useUpdateUserSettings, useResetData } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { RotateCcw, Save } from 'lucide-react';
import type { Settings as SettingsType } from '@/backend';

export default function Settings() {
  const { data: currentSettings } = useGetUserSettings();
  const updateSettings = useUpdateUserSettings();
  const resetData = useResetData();

  const [settings, setSettings] = useState<SettingsType>({
    recentFormWindow: BigInt(5),
    recencyWeighting: 0.7,
    doNotBetMode: true,
    autoBetSizing: true,
    strategyMode: 'Balanced',
    sessionOnlyMode: false,
  });

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    }
  };

  const handleReset = async () => {
    try {
      await resetData.mutateAsync();
      toast.success('All data has been reset');
    } catch (error) {
      toast.error('Failed to reset data');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your betting assistant</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>Adjust how the prediction model behaves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="window">Recent Form Window Size</Label>
            <Input
              id="window"
              type="number"
              min="1"
              max="20"
              value={Number(settings.recentFormWindow)}
              onChange={(e) =>
                setSettings({ ...settings, recentFormWindow: BigInt(e.target.value) })
              }
            />
            <p className="text-sm text-muted-foreground">
              Number of recent races to consider for form analysis (default: 5)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Recency Weighting Strength: {settings.recencyWeighting.toFixed(2)}</Label>
            <Slider
              value={[settings.recencyWeighting]}
              onValueChange={([value]) =>
                setSettings({ ...settings, recencyWeighting: value })
              }
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              How much to prioritize recent races over historical data
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Default Strategy Mode</Label>
            <Select
              value={settings.strategyMode}
              onValueChange={(value) => setSettings({ ...settings, strategyMode: value })}
            >
              <SelectTrigger id="strategy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Safe">Safe Mode</SelectItem>
                <SelectItem value="Balanced">Balanced Mode</SelectItem>
                <SelectItem value="Value">Value Mode</SelectItem>
                <SelectItem value="Aggressive">Aggressive Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Betting Behavior</CardTitle>
          <CardDescription>Control automatic betting features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="skip">Enable "Do Not Bet" Mode</Label>
              <p className="text-sm text-muted-foreground">
                Skip races with insufficient edge
              </p>
            </div>
            <Switch
              id="skip"
              checked={settings.doNotBetMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, doNotBetMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto">Auto Bet Sizing</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust bet sizes based on confidence
              </p>
            </div>
            <Switch
              id="auto"
              checked={settings.autoBetSizing}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoBetSizing: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session">Session-Only Mode</Label>
              <p className="text-sm text-muted-foreground">
                Only use current session data (vs lifetime)
              </p>
            </div>
            <Switch
              id="session"
              checked={settings.sessionOnlyMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, sessionOnlyMode: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1" onClick={handleSave} disabled={updateSettings.isPending}>
          <Save className="mr-2 h-5 w-5" />
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" variant="destructive">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your race history,
                model statistics, and settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset Everything</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
