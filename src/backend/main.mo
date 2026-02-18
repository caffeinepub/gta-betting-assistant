import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Bool "mo:core/Bool";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

actor {
  type RaceOutcome = {
    winner : Nat;
    secondPlace : Nat;
    thirdPlace : Nat;
  };

  type RaceEntry = {
    odds : [Float];
    timestamp : Time.Time;
    outcome : ?RaceOutcome;
    modelPrediction : Nat;
    betSize : Nat;
    followedRecommendation : Bool;
  };

  module RaceEntry {
    public func compareByTimestamp(a : RaceEntry, b : RaceEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type ModelStats = {
    recentAccuracy : Float;
    calibration : Float;
    confidenceLevel : Text;
  };

  type Settings = {
    recentFormWindow : Nat;
    recencyWeighting : Float;
    doNotBetMode : Bool;
    autoBetSizing : Bool;
    strategyMode : Text;
    sessionOnlyMode : Bool;
  };

  let raceHistory = Map.empty<Principal, [RaceEntry]>();
  let modelStats = Map.empty<Principal, ModelStats>();
  let userSettings = Map.empty<Principal, Settings>();

  public shared ({ caller }) func logRaceEntry(
    odds : [Float],
    modelPrediction : Nat,
    betSize : Nat,
    followedRecommendation : Bool,
  ) : async () {
    if (odds.size() != 6) {
      Runtime.trap("Invalid number of odds. Must be 6.");
    };

    let entry : RaceEntry = {
      odds;
      timestamp = Time.now();
      outcome = null;
      modelPrediction;
      betSize;
      followedRecommendation;
    };

    let userHistory = switch (raceHistory.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };

    raceHistory.add(caller, userHistory.concat([entry]));
  };

  public shared ({ caller }) func updateRaceOutcome(
    raceIndex : Nat,
    winner : Nat,
    secondPlace : Nat,
    thirdPlace : Nat,
  ) : async () {
    let userHistory = switch (raceHistory.get(caller)) {
      case (null) { Runtime.trap("No race history found for user") };
      case (?entries) { entries };
    };

    if (raceIndex >= userHistory.size()) {
      Runtime.trap("Invalid race index");
    };

    let outcome : RaceOutcome = {
      winner;
      secondPlace;
      thirdPlace;
    };

    let updatedEntry = {
      odds = userHistory[raceIndex].odds;
      timestamp = userHistory[raceIndex].timestamp;
      outcome = ?outcome;
      modelPrediction = userHistory[raceIndex].modelPrediction;
      betSize = userHistory[raceIndex].betSize;
      followedRecommendation = userHistory[raceIndex].followedRecommendation;
    };

    let newHistory = Array.tabulate(
      userHistory.size(),
      func(i) {
        if (i == raceIndex) { updatedEntry } else {
          userHistory[i];
        };
      },
    );

    raceHistory.add(caller, newHistory);
  };

  public shared ({ caller }) func updateModelStats(newStats : ModelStats) : async () {
    modelStats.add(caller, newStats);
  };

  public shared ({ caller }) func updateUserSettings(newSettings : Settings) : async () {
    userSettings.add(caller, newSettings);
  };

  public query ({ caller }) func getRaceHistory() : async [RaceEntry] {
    switch (raceHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };
  };

  public query ({ caller }) func getModelStats() : async ?ModelStats {
    modelStats.get(caller);
  };

  public query ({ caller }) func getUserSettings() : async ?Settings {
    userSettings.get(caller);
  };

  public shared ({ caller }) func resetData() : async () {
    raceHistory.remove(caller);
    modelStats.remove(caller);
    userSettings.remove(caller);
  };
};
