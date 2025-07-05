# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a functional Breakout clone game built with Phaser 3, TypeScript, and Vite. The game features:
- Ball physics with paddle/brick collision
- Mouse-controlled paddle
- Destructible brick grid (7 rows)
- Lives system (3 lives)
- Score tracking
- Start/game over screens
- Pause functionality
- Responsive scaling (768x1024 internal resolution)

## Development Sessions

This project uses organized development sessions documented in `docs/dev-sessions/` directories. Each session follows the pattern:
- `docs/dev-sessions/YYYY-MM-DD-HHMM-{slug}/`
- Contains: `spec.md`, `plan.md`, `todo.md`, `notes.md`

When starting a new development session, create the appropriate session directory structure and documentation files.

## Architecture

### Core Structure
- `/src/main.ts` - Game initialization and Phaser configuration
- `/src/config/GameConfig.ts` - Centralized configuration for all game parameters
- `/src/scenes/` - Phaser scenes (StartScene, GameScene, GameOverScene)
- `/src/objects/` - Game object classes (Ball, Paddle, Brick, BrickGrid)

### Key Classes
- `Ball` - Physics-enabled ball with bounce mechanics and speed control
- `Paddle` - Mouse-controlled paddle with 1:1 movement
- `Brick` & `BrickGrid` - Individual bricks and automatic grid generation
- Game scenes handle state transitions and UI management

### Configuration System
All game parameters are centralized in `GameConfig.ts` for easy tuning:
- Object dimensions, physics constants
- UI positioning and colors
- Game flow parameters

## Common Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build

# The game uses Vite for fast development with hot module replacement
```

## Testing the Game

1. Run `npm run dev`
2. Open browser to localhost:3000
3. Click "Click to Start" on start screen
4. Use mouse to control paddle
5. Click to launch ball when prompted
6. ESC or pause button to pause/resume