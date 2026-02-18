import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RaceEntry, ModelStats, Settings } from '@/backend';

export function useGetRaceHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<RaceEntry[]>({
    queryKey: ['raceHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRaceHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetModelStats() {
  const { actor, isFetching } = useActor();

  return useQuery<ModelStats | null>({
    queryKey: ['modelStats'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModelStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<Settings | null>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogRaceEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      odds: number[];
      modelPrediction: bigint;
      betSize: bigint;
      followedRecommendation: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logRaceEntry(
        params.odds,
        params.modelPrediction,
        params.betSize,
        params.followedRecommendation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raceHistory'] });
    },
  });
}

export function useUpdateRaceOutcome() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      raceIndex: number;
      winner: bigint;
      secondPlace: bigint;
      thirdPlace: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateRaceOutcome(
        BigInt(params.raceIndex),
        params.winner,
        params.secondPlace,
        params.thirdPlace
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raceHistory'] });
      queryClient.invalidateQueries({ queryKey: ['modelStats'] });
    },
  });
}

export function useUpdateModelStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stats: ModelStats) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateModelStats(stats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelStats'] });
    },
  });
}

export function useUpdateUserSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateUserSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
}

export function useResetData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.resetData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
