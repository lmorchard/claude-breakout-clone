# Multiball Feature Implementation Plan

## Overview
This plan breaks down the multiball feature implementation into small, incremental steps that build upon each other. Each phase is designed to be testable in isolation before moving to the next phase.

## Technical Approach
1. **Configuration First**: Add all config properties upfront
2. **Foundation Changes**: Modify existing single-ball system to support multiple balls
3. **Powerup Infrastructure**: Build generic powerup system before specific powerups
4. **Multiball Powerup**: Implement the specific multiball powerup behavior
5. **Integration & Polish**: Wire everything together and test edge cases

## Dependencies
- Existing Ball, Paddle, Brick, and BrickGrid classes
- Phaser 3 physics and collision system
- GameScene state management

## Phase-by-Phase Implementation

### Phase 1: Configuration Setup
Add new configuration properties to support powerups and multiple balls.

**Prompt 1.1: Add powerup and multiball configuration**
```
Update src/config/GameConfig.ts to add the following new properties:
- POWERUP_SPAWN_CHANCE: 0.1 (10% chance when brick destroyed)
- POWERUP_FALL_SPEED: 100 (pixels per second downward)
- POWERUP_COLOR: 0x90EE90 (light green color)
- BALL_SPAWN_OFFSET: 30 (pixels between spawned balls)

Add these in appropriate sections with clear comments.
```

### Phase 2: Multiple Ball Support
Transform the single ball system into a multi-ball system without changing game behavior yet.

**Prompt 2.1: Convert single ball to ball array**
```
In src/scenes/GameScene.ts:
1. Change the 'ball' property from Ball to Ball[] array
2. Initialize with single ball in create()
3. Update all ball references to work with array (using forEach/map)
4. Ensure update(), physics, and collision handlers work with multiple balls
5. Keep game behavior identical - still one ball for now
```

**Prompt 2.2: Update ball lifecycle management**
```
In src/scenes/GameScene.ts:
1. Create addBall(x, y, velocityX, velocityY) method to spawn new balls
2. Create removeBall(ball) method to safely remove balls
3. Update ballOutOfBounds to only lose life when last ball is lost
4. Add ballCount tracking property
5. Update resetBall to clear all balls and spawn single new one
```

**Prompt 2.3: Add ball-to-ball collision**
```
In src/scenes/GameScene.ts:
1. Add physics collision between balls in setupPhysics()
2. Create ballHitBall(ball1, ball2) handler using same bounce logic as walls
3. Ensure balls bounce off each other without destruction
4. Test with manually spawned second ball
```

### Phase 3: Powerup System Infrastructure
Build the generic powerup system that can support multiple powerup types.

**Prompt 3.1: Create base Powerup class**
```
Create src/objects/Powerup.ts:
1. Extend Phaser.Physics.Arcade.Sprite
2. Constructor takes scene, x, y, powerupType
3. Set size to match brick dimensions (100x25)
4. Add rounded rectangle graphics with GameConfig.POWERUP_COLOR
5. Set velocity to (0, GameConfig.POWERUP_FALL_SPEED)
6. Add powerupType property for identification
7. Add activate() method (to be overridden by subclasses)
```

**Prompt 3.2: Create MultiballPowerup subclass**
```
Create src/objects/MultiballPowerup.ts:
1. Extend Powerup class
2. In constructor, draw ball icon inside the rounded rectangle
3. Set powerupType to 'multiball'
4. Override activate() to receive gameScene parameter
5. Leave activate() implementation empty for now (will implement later)
```

**Prompt 3.3: Add powerup management to GameScene**
```
In src/scenes/GameScene.ts:
1. Add powerups: Phaser.Physics.Arcade.Group property
2. Create powerups group in create() method
3. Add spawnPowerup(x, y, type) method
4. Add physics overlap between powerups and paddle
5. Add powerupHitPaddle(paddle, powerup) handler that calls powerup.activate(this)
6. Add cleanup in update() to remove powerups that fall off screen
```

### Phase 4: Integrate Powerup Spawning
Connect powerup spawning to brick destruction.

**Prompt 4.1: Add powerup spawning to brick destruction**
```
In src/scenes/GameScene.ts:
1. Update ballHitBrick method
2. After brick destruction, check Math.random() < GameConfig.POWERUP_SPAWN_CHANCE
3. If true, call spawnPowerup(brick.x, brick.y, 'multiball')
4. Ensure powerup spawns at exact brick position
```

### Phase 5: Implement Multiball Behavior
Complete the multiball powerup functionality.

**Prompt 5.1: Implement multiball activation**
```
In src/objects/MultiballPowerup.ts:
1. Implement activate(gameScene) method
2. Get current balls array from gameScene
3. For each existing ball:
   - Calculate new position (x + GameConfig.BALL_SPAWN_OFFSET, y)
   - Get ball's current velocity
   - Call gameScene.addBall() with inverted X velocity
4. Remove the powerup after activation
```

**Prompt 5.2: Polish ball spawning**
```
In src/scenes/GameScene.ts:
1. Update addBall to check spawn position is within bounds
2. If out of bounds, adjust position to stay in play area
3. Ensure new balls don't spawn inside bricks or walls
4. Add slight random Y offset to prevent perfect overlaps
```

### Phase 6: Testing and Edge Cases

**Prompt 6.1: Add testing helpers and fix edge cases**
```
In src/scenes/GameScene.ts:
1. Add debug key (e.g., 'M') to manually spawn multiball powerup
2. Fix any edge cases with ball array management
3. Ensure proper cleanup when transitioning scenes
4. Test with many balls (10+) for performance
5. Verify ball counter accuracy
```

## Implementation Order Summary
1. Configuration setup
2. Single ball → multiple ball array
3. Ball lifecycle and collision management  
4. Generic powerup system
5. Multiball powerup class
6. Powerup spawning from bricks
7. Multiball activation logic
8. Polish and edge cases