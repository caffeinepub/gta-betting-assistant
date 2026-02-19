# Specification

## Summary
**Goal:** Allow odds input fields to be completely emptied without auto-filling, enabling users to replace values more easily.

**Planned changes:**
- Modify ContenderOddsRow component to accept empty string state in numerator input fields
- Remove auto-fill behavior that inserts '1' when field is cleared
- Update implied probability calculation to only display when valid number (1-30) is entered
- Set all 6 contender input fields to start empty by default on New Bet page load

**User-visible outcome:** Users can clear odds input fields completely and type new values without the field auto-filling with '1', making it easier to enter and replace odds values.
