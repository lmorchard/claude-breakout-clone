# Multiball Feature Specification

## Overview

Let's introduce a few new concepts:

### Powerups

- Occasionally when a brick is destroyed, a new object spawns in - this object is a "powerup"
- This powerup is an object in the game that drifts slowly down the screen
- If it passes the bottom of the screen, it is removed from play and nothing happens
- When a powerup collides with the player's paddle, it is removed from play and an interesting event occurs that modifies gameplay

### Multiple balls

- Ensure that the game can handle multiple balls - we should not be limited to just one ball in flight
- Additional balls behave the same as the original ball: they bounce, they destroy bricks, they remove player lives when they travel past the bottom of the screen
- Balls also bounce off each other, but do not destroy each other
- Let's not implement a limit to the number of balls for now.

### Multi-ball powerup

- Let's introduce a new powerup: Multi-ball
- It's shape in the game should be brick-sized but with rounded corners and a ball shape should appear inside.
- When this powerup collides with the player's paddle, do the following:
  - For every ball currently in play, spawn another nearby and invert it's velocity in the X-axis

## Requirements

### Configuration Properties
Add the following properties to `src/config/GameConfig.ts`:
- `POWERUP_SPAWN_CHANCE: 0.1` (10% chance)
- `POWERUP_FALL_SPEED: 100` (pixels per second)
- `POWERUP_COLOR: 0x90EE90` (light green)
- `BALL_SPAWN_OFFSET: 30` (pixels apart for new balls)

### Powerup System
- Powerups have a 10% chance to spawn when any brick is destroyed (regardless of cause)
- Powerups spawn at the exact position where the destroyed brick was located
- Powerups are brick-sized with rounded corners and contain a ball icon inside
- Powerups fall at constant 100px/s speed (no gravity acceleration)
- Powerups are removed when they reach the bottom of the screen
- When powerup collides with paddle, it activates and is removed

### Multiple Ball System
- Game must support unlimited number of balls simultaneously
- All balls behave identically: bounce off walls/paddle/bricks, destroy bricks
- Ball-to-ball collisions use same bounce physics as other collisions
- Maintain count of active balls in play
- Player loses life only when the last ball exits the bottom of the screen
- On life loss, game resets to single ball state

### Multiball Powerup Behavior
- When collected by paddle:
  - For each existing ball in play, spawn a new ball nearby (30px offset)
  - New ball maintains original Y-velocity but inverts X-velocity
  - Balls immediately move apart to avoid collision
- No persistent player state changes (effect is instantaneous)
- Visual feedback deferred for future implementation

## Acceptance Criteria

### Core Functionality
- [ ] Powerups spawn from destroyed bricks with 10% probability
- [ ] Powerups fall at steady 100px/s and disappear at screen bottom
- [ ] Powerups activate when touching paddle
- [ ] Game supports multiple balls without limit
- [ ] Ball count is accurately tracked
- [ ] Life lost only when all balls are gone

### Multiball Powerup
- [ ] Multiball powerup appears as light green brick-sized rounded rectangle with ball icon
- [ ] Collection doubles current ball count
- [ ] New balls spawn 30px offset from originals
- [ ] New balls have inverted X-velocity, same Y-velocity
- [ ] Balls immediately separate without collision

### Ball Physics
- [ ] Ball-to-ball collisions behave like other collision types
- [ ] Multiple balls interact correctly with paddle and bricks
- [ ] All balls can destroy bricks and affect score

### Game State
- [ ] Game resets to single ball after life loss
- [ ] Configuration properties are properly integrated
- [ ] No lingering powerup state after life loss