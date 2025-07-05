# Session Spec: Initial Setup

## Overview

We want to start building a basic clone of the classic game breakout. In short, this game consists of the following:

- At the top of the screen, there's a staggered grid of brick-shaped blocks that fills the screen width and descends for about 7 rows.
- At the bottom of the screen, there's a player "paddle" that can move horizontally based on mouse movement.
- There is a "ball" which starts in the middle of the screen with initial movement toward the paddle.
- The ball will bounce when it hits the player paddle or the sides of the screen.
- The player has 3 "lives" - if the ball moves past the player's paddle and the bottom of the screen, the player loses a "life" and the ball starts again in the center of the screen
- If the player has 0 lives, the game is over. They have the option to play again.
- If the ball contacts one of the bricks, it bounces off the brick but the brick is destroyed.
- If all bricks are destroyed, the player "wins", the game is over, and they have an option to play again.
- The player has a score. They get one point for every destroyed brick.

Let's build this game using the Phaser game framework and Vite for the dev server and bundling.
Use TypeScript for the game code.

## Goals

- Set up basic project structure
- Configure development environment
- Create foundational game architecture

## Technical Requirements

### Core Technologies
- **Framework**: Phaser game framework
- **Build Tool**: Vite for dev server and bundling  
- **Language**: TypeScript for all game code

### Game Resolution & Display
- **Internal Game Resolution**: 768 x 1024 pixels (3:4 aspect ratio)
- **Display**: Responsive scaling to fill browser window while maintaining consistent game coordinates
- **Scaling**: Decouple internal game resolution from browser resolution

### Game Objects & Dimensions

#### Ball
- **Size**: 20x20 pixel circle
- **Speed**: 250 pixels per second (configurable)
- **Physics**: Variable bounce angles based on collision point on paddle/bricks
- **Collision**: Rectangular bounding box detection initially
- **Behavior**: Different bounce behavior for edge vs face collisions (realistic physics feel)

#### Bricks  
- **Dimensions**: 100x25 pixels (4:1 width:height ratio)
- **Layout**: 7 rows, fills screen width with consistent spacing
- **Spacing**: 10px between bricks and screen edges
- **Grid**: ~6-7 bricks per row (depending on exact spacing calculations)
- **Scoring**: 1 point per brick (uniform for initial version)
- **Destruction**: Single hit destroys brick

#### Paddle
- **Dimensions**: 100x25 pixels (same as bricks initially)
- **Position**: 50px from bottom of playfield
- **Movement**: 1:1 with mouse movement
- **Collision**: Variable bounce angles based on hit location

### User Interface
- **Status Bar**: Top of screen above brick grid
  - Score display
  - Remaining lives counter  
  - Pause button
- **Margins**: Additional spacing between status bar and brick grid

### Game Flow & States
- **Start Screen**: Simple menu before gameplay begins
- **Life System**: 3 lives total
- **Ball Respawn**: Brief pause with "ready" prompt before ball launches
- **Game Over**: Option to play again when lives reach 0
- **Victory**: Option to play again when all bricks destroyed

### Configuration System
- **Parameters**: Centralized data structure for all game feel parameters
  - Ball speed, size, physics constants
  - Paddle dimensions, positioning, responsiveness  
  - Brick dimensions, spacing, scoring values
  - UI positioning and margins
- **Purpose**: Enable easy tuning and potential mid-game adjustments (future powerups)

## Success Criteria

### Initial Setup Session
- [ ] Project structure created with Vite + TypeScript + Phaser
- [ ] Development environment configured and running
- [ ] Basic game architecture established with configurable parameters
- [ ] Core game objects (ball, paddle, bricks) implemented with basic physics
- [ ] Simple collision detection working between all game objects
- [ ] Basic UI elements displaying (score, lives, pause)
- [ ] Game states implemented (start menu, gameplay, game over)
- [ ] Responsive scaling system working

### Functional Requirements
- [ ] Ball bounces realistically off paddle, bricks, and walls
- [ ] Bricks destroyed on ball contact
- [ ] Lives decremented when ball passes paddle
- [ ] Score incremented when bricks destroyed
- [ ] Game over/victory states trigger appropriately
- [ ] Start screen and respawn flow working smoothly