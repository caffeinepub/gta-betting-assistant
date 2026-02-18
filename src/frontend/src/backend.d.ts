import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RaceEntry {
    followedRecommendation: boolean;
    odds: Array<number>;
    betSize: bigint;
    modelPrediction: bigint;
    timestamp: Time;
    outcome?: RaceOutcome;
}
export interface Settings {
    autoBetSizing: boolean;
    sessionOnlyMode: boolean;
    doNotBetMode: boolean;
    recentFormWindow: bigint;
    strategyMode: string;
    recencyWeighting: number;
}
export interface ModelStats {
    confidenceLevel: string;
    recentAccuracy: number;
    calibration: number;
}
export type Time = bigint;
export interface RaceOutcome {
    thirdPlace: bigint;
    winner: bigint;
    secondPlace: bigint;
}
export interface backendInterface {
    getModelStats(): Promise<ModelStats | null>;
    getRaceHistory(): Promise<Array<RaceEntry>>;
    getUserSettings(): Promise<Settings | null>;
    logRaceEntry(odds: Array<number>, modelPrediction: bigint, betSize: bigint, followedRecommendation: boolean): Promise<void>;
    resetData(): Promise<void>;
    updateModelStats(newStats: ModelStats): Promise<void>;
    updateRaceOutcome(raceIndex: bigint, winner: bigint, secondPlace: bigint, thirdPlace: bigint): Promise<void>;
    updateUserSettings(newSettings: Settings): Promise<void>;
}
