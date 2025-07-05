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

## Requirements

TBD - to be filled in during planning phase

## Success Criteria

TBD - to be defined during planning phase