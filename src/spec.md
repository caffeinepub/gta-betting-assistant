# Specification

## Summary
**Goal:** Build a GTA Online horse racing betting assistant with adaptive learning, multiple strategy modes, and intelligent bet sizing that learns from race outcomes to improve predictions over time.

**Planned changes:**
- Create Dashboard page displaying 7 primary stats (Total Races, Total Bets, Profit/Loss, ROI, Accuracy, Session P/L, Calibration Score), Model Health Indicator (High/Medium/Low confidence), current strategy mode, last prediction summary, and quick action buttons (New Bet, Log Race Result, History, Reset Data, Settings)
- Build New Bet page with 6 contender rows (#1-#6), numeric odds input (1-30/1 format), real-time implied win probability calculation, live odds summary panel with overround and warnings, and strategy mode selector (Safe/Balanced/Value/Aggressive)
- Implement prediction engine backend that validates odds, computes implied probabilities, retrieves historical stats, calculates 4 model signals (Market Odds, Historical Performance, Recent Form, Consistency/Variance), applies feature weights, generates win probabilities, and recommends best bet with size (1k-10k in $1k increments)
- Display prediction results showing recommended contender, predicted win probability, implied odds probability, value edge, confidence level, recommended bet size, and reasoning panel breaking down the 4 signals with scores and trust weights
- Add "Do Not Bet" safeguard logic that recommends skipping races when no contender shows sufficient positive expected value
- Implement intelligent bet sizing that adjusts based on edge strength, model confidence, contender variance, and recent performance
- Create Race Result Logging page with quick dropdowns/buttons for Winner, Second Place, Third Place, storing full race data and triggering model updates
- Build adaptive learning system that updates feature weights after each race based on prediction accuracy, tracks model calibration over time, and recalibrates when consistently over/under confident
- Implement contender-level consistency scoring tracking variance and unpredictability, reducing confidence and bet sizes for high-variance contenders
- Add recency weighting system where recent races matter more than older races in calculations
- Create History page with scrollable list of all logged races showing timestamp, odds, finishers, recommendation, bet size, correctness, profit/loss, with JSON/CSV export
- Build Contender Statistics page displaying individual profiles for each contender (#1-#6) with win/place/show rate, last 5 finishes, streak status, average implied odds, overperformance metric, and consistency score
- Create Settings page with controls for reset data, recent-form window size, recency weighting strength, "Do Not Bet" toggle, auto bet sizing toggle, default strategy mode, and session-only vs lifetime mode
- Implement local persistent storage for all race history, model state, feature weights, and contender statistics
- Display contextual warnings and guidance messages throughout (low confidence, high variance, no value detected)
- Add session summary after every 10-20 races showing profit/loss, best/worst contender, most accurate/profitable strategy mode, and current trust weights
- Design clean, fast, minimalist UI with dark/neutral color scheme, high-contrast typography, and glanceable stats

**User-visible outcome:** Users can input horse racing odds for 6 contenders, receive AI-powered betting recommendations with transparent reasoning, log race results, and watch the system learn and improve its predictions over time through an adaptive learning engine that adjusts to actual outcomes.
