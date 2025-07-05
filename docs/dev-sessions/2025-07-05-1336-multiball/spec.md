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
TBD

## Acceptance Criteria
TBD