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

We want to organize thoughts around discrete development sessions.

Each development sessions may be aimed at building a specific complete feature - or just a part of a feature built in phases.

Documentation and artifacts for a session should live in a directory of the current project called `docs/dev-sessions/$(date +"%Y-%m-%d-%H%M")-{slug}` where `$(date +"%Y-%m-%d-%H%M")` is a bash command and `{slug}` is a short description of the session. If possible, derive the slug from the name of the current git branch, otherwise ask me to provide a short description.

In this directory will live at least the following files:

- `spec.md` - the spec for the session
- `plan.md` - the plan for the session
- `todo.md` - the todo list for the session
- `notes.md` - the notes for the session, including a final summary of the session before committing to git

Other files may live in this directory as appropriate to the session. 

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
