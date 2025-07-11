export const GameConfig = {
  // Game Resolution
  GAME_WIDTH: 768,
  GAME_HEIGHT: 1024,

  // Ball Properties
  BALL_SIZE: 20,
  BALL_SPEED: 500, // pixels per second (doubled from 250)

  // Paddle Properties  
  PADDLE_WIDTH: 100,
  PADDLE_HEIGHT: 25,
  PADDLE_Y_OFFSET: 50, // distance from bottom

  // Brick Properties
  BRICK_WIDTH: 100,
  BRICK_HEIGHT: 25,
  BRICK_ROWS: 7,
  BRICK_SPACING: 10, // spacing between bricks and edges
  BRICK_POINTS: 1,

  // UI Properties
  STATUS_BAR_HEIGHT: 60,
  STATUS_BAR_MARGIN: 10,

  // Game Properties
  INITIAL_LIVES: 3,
  READY_DELAY: 2000, // milliseconds

  // Powerup Properties
  POWERUP_SPAWN_CHANCE: 0.1, // 10% chance when brick destroyed
  POWERUP_FALL_SPEED: 100, // pixels per second downward
  BALL_SPAWN_OFFSET: 80, // pixels between spawned balls

  // Colors
  COLORS: {
    BACKGROUND: 0x000000,
    BALL: 0xffffff,
    PADDLE: 0xffffff,
    BRICK: 0xff6b6b,
    TEXT: 0xffffff,
    UI_BACKGROUND: 0x333333,
    BOUNDARY: 0x666666,
    POWERUP: 0x90EE90 // light green
  }
} as const