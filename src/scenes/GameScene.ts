import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'
import { Ball } from '../objects/Ball'
import { Paddle } from '../objects/Paddle'
import { BrickGrid } from '../objects/Brick'
import { Powerup } from '../objects/Powerup'
import { MultiballPowerup } from '../objects/MultiballPowerup'

export class GameScene extends Phaser.Scene {
  private score: number = 0
  private lives: number = GameConfig.INITIAL_LIVES
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private ballCountText!: Phaser.GameObjects.Text
  private pauseButton!: Phaser.GameObjects.Text
  private isPaused: boolean = false

  // Game objects
  private balls: Ball[] = []
  private paddle!: Paddle
  private brickGrid!: BrickGrid
  private powerups!: Phaser.Physics.Arcade.Group
  private isWaitingToStart: boolean = false
  private readyText?: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.score = 0
    this.lives = GameConfig.INITIAL_LIVES
    this.isPaused = false

    this.createUI()
    this.createGameObjects()
    this.setupInput()
    this.setupCollisions()
    
    // Start with "ready" state
    this.showReadyPrompt()
  }

  private createUI() {
    const margin = GameConfig.STATUS_BAR_MARGIN

    // Score
    this.scoreText = this.add.text(margin, margin, `Score: ${this.score}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    })

    // Lives
    this.livesText = this.add.text(GameConfig.GAME_WIDTH / 2, margin, `Lives: ${this.lives}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5, 0)

    // Ball count (for debugging)
    this.ballCountText = this.add.text(GameConfig.GAME_WIDTH / 2, margin + 25, `Balls: ${this.getBallCount()}`, {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5, 0)

    // Pause button
    this.pauseButton = this.add.text(GameConfig.GAME_WIDTH - margin, margin, 'PAUSE', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(1, 0)
    .setInteractive()
    .on('pointerdown', () => this.togglePause())
  }

  private createGameObjects() {
    // Create visible boundaries
    this.createBoundaries()
    
    // Create paddle
    this.paddle = new Paddle(this)
    
    // Create initial ball
    const initialBall = new Ball(this, GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2)
    this.balls = [initialBall]
    
    // Create brick grid
    this.brickGrid = new BrickGrid(this)
    
    // Create powerups group
    this.powerups = this.physics.add.group()
    
    // Setup collisions for initial ball
    this.balls.forEach(ball => this.setupBallCollisions(ball))
    
    // Setup powerup collisions
    this.setupPowerupCollisions()
  }

  private createBoundaries() {
    const boundaryColor = GameConfig.COLORS.BOUNDARY
    const boundaryThickness = 2

    // Top boundary
    this.add.rectangle(
      GameConfig.GAME_WIDTH / 2, 
      boundaryThickness / 2, 
      GameConfig.GAME_WIDTH, 
      boundaryThickness, 
      boundaryColor
    )

    // Left boundary
    this.add.rectangle(
      boundaryThickness / 2, 
      GameConfig.GAME_HEIGHT / 2, 
      boundaryThickness, 
      GameConfig.GAME_HEIGHT, 
      boundaryColor
    )

    // Right boundary
    this.add.rectangle(
      GameConfig.GAME_WIDTH - boundaryThickness / 2, 
      GameConfig.GAME_HEIGHT / 2, 
      boundaryThickness, 
      GameConfig.GAME_HEIGHT, 
      boundaryColor
    )
  }

  private setupInput() {
    // ESC key for pause
    this.input.keyboard!.on('keydown-ESC', () => {
      this.togglePause()
    })
    
    // Debug key 'M' to spawn multiball powerup
    this.input.keyboard!.on('keydown-M', () => {
      if (!this.isPaused && !this.isWaitingToStart) {
        const centerX = GameConfig.GAME_WIDTH / 2
        const centerY = GameConfig.GAME_HEIGHT / 2
        this.spawnPowerup(centerX, centerY, 'multiball')
        console.log('Debug: Spawned multiball powerup at center')
      }
    })
  }

  private setupCollisions() {
    // Will be called for each ball
  }

  private setupBallCollisions(ball: Ball) {
    // Ball vs Paddle
    this.physics.add.collider(ball, this.paddle, () => {
      ball.bounceOffPaddle(this.paddle)
    })

    // Ball vs Bricks
    this.physics.add.collider(ball, this.brickGrid.getBricks(), (_ball, brick) => {
      // Store brick position before destruction
      const brickX = (brick as any).x
      const brickY = (brick as any).y
      
      // Determine collision side (simplified)
      ball.bounceOffBrick('top')
      
      // Destroy brick and award points
      const points = this.brickGrid.destroyBrick(brick as any)
      this.updateScore(points)
      
      // Check for powerup spawn
      if (Math.random() < GameConfig.POWERUP_SPAWN_CHANCE) {
        this.spawnPowerup(brickX, brickY, 'multiball')
      }
      
      // Check for victory
      if (this.brickGrid.areAllDestroyed()) {
        this.scene.start('GameOverScene', { score: this.score, won: true })
      }
    })
    
    // Ball vs other balls
    this.balls.forEach(otherBall => {
      if (otherBall !== ball) {
        this.physics.add.collider(ball, otherBall, () => {
          this.ballHitBall(ball, otherBall)
        })
      }
    })
  }

  private showReadyPrompt() {
    this.isWaitingToStart = true
    
    // Reset to single ball at center
    this.balls.forEach(ball => ball.destroy())
    this.balls = []
    const newBall = new Ball(this, GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2)
    this.balls.push(newBall)
    this.setupBallCollisions(newBall)
    
    // Stop ball movement
    if (newBall.body) {
      const body = newBall.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0, 0)
    }

    this.readyText = this.add.text(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2 + 100, 
      'Click to Launch Ball', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    // Start ball on click
    this.input.once('pointerdown', () => {
      this.startBall()
    })
  }

  private startBall() {
    this.isWaitingToStart = false
    if (this.readyText) {
      this.readyText.destroy()
      this.readyText = undefined
    }
    // Reset the first ball
    if (this.balls[0]) {
      this.balls[0].resetBall()
    }
  }

  update() {
    if (this.isPaused || this.isWaitingToStart) return

    // Update all balls
    const ballsToRemove: Ball[] = []
    
    this.balls.forEach(ball => {
      ball.update()
      
      // Check if ball fell off bottom
      if (ball.checkBottomBoundary()) {
        ballsToRemove.push(ball)
      }
    })
    
    // Remove balls that went out of bounds
    ballsToRemove.forEach(ball => {
      const index = this.balls.indexOf(ball)
      if (index > -1) {
        this.balls.splice(index, 1)
        ball.destroy()
      }
    })
    
    // Check if all balls are gone
    if (this.balls.length === 0) {
      this.loseLife()
    }
    
    // Update powerups
    this.powerups.children.entries.forEach(powerup => {
      if (powerup instanceof Powerup) {
        powerup.update()
      }
    })
    
    // Update ball count display
    this.ballCountText.setText(`Balls: ${this.getBallCount()}`)
  }

  private togglePause() {
    this.isPaused = !this.isPaused
    
    if (this.isPaused) {
      this.physics.pause()
      this.pauseButton.setText('RESUME')
      
      // Show pause overlay
      this.add.rectangle(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2, 
                        GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT, 0x000000, 0.5)
      this.add.text(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2, 'PAUSED', {
        fontSize: '48px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      }).setOrigin(0.5)
    } else {
      this.physics.resume()
      this.pauseButton.setText('PAUSE')
      // Note: In a real implementation, we'd need to remove the pause overlay
      // For now, we'll restart the scene to clear it
      this.scene.restart()
    }
  }

  public updateScore(points: number) {
    this.score += points
    this.scoreText.setText(`Score: ${this.score}`)
  }

  public loseLife() {
    this.lives--
    this.livesText.setText(`Lives: ${this.lives}`)
    
    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { score: this.score, won: false })
    } else {
      // Show ready prompt for next life
      this.showReadyPrompt()
    }
  }

  public addBall(x: number, y: number, velocityX: number, velocityY: number): Ball {
    console.log(`addBall called with: x=${x}, y=${y}, vx=${velocityX}, vy=${velocityY}`)
    
    // Ensure spawn position is within bounds
    let adjustedX = x
    let adjustedY = y
    
    const ballRadius = GameConfig.BALL_SIZE / 2
    const minX = ballRadius
    const maxX = GameConfig.GAME_WIDTH - ballRadius
    const minY = GameConfig.STATUS_BAR_HEIGHT + ballRadius
    const maxY = GameConfig.GAME_HEIGHT - ballRadius
    
    // Clamp position to valid bounds
    adjustedX = Math.max(minX, Math.min(maxX, adjustedX))
    adjustedY = Math.max(minY, Math.min(maxY, adjustedY))
    
    console.log(`Position adjusted from (${x}, ${y}) to (${adjustedX}, ${adjustedY})`)
    
    // Add small random Y offset to prevent perfect overlaps
    adjustedY += (Math.random() - 0.5) * 10
    
    console.log(`Final position after random offset: (${adjustedX}, ${adjustedY})`)
    
    const newBall = new Ball(this, adjustedX, adjustedY)
    this.balls.push(newBall)
    this.setupBallCollisions(newBall)
    
    // Setup collisions with existing balls
    this.balls.forEach(existingBall => {
      if (existingBall !== newBall) {
        this.physics.add.collider(existingBall, newBall, () => {
          this.ballHitBall(existingBall, newBall)
        })
      }
    })
    
    // Set velocity after ball is created
    if (newBall.body) {
      const body = newBall.body as Phaser.Physics.Arcade.Body
      body.setVelocity(velocityX, velocityY)
    }
    
    return newBall
  }

  public removeBall(ball: Ball) {
    const index = this.balls.indexOf(ball)
    if (index > -1) {
      this.balls.splice(index, 1)
      ball.destroy()
    }
  }

  public getBallCount(): number {
    return this.balls.length
  }

  private ballHitBall(ball1: Ball, ball2: Ball) {
    // Get velocities
    const body1 = ball1.body as Phaser.Physics.Arcade.Body
    const body2 = ball2.body as Phaser.Physics.Arcade.Body
    
    // Simple elastic collision - swap velocities
    const v1x = body1.velocity.x
    const v1y = body1.velocity.y
    const v2x = body2.velocity.x
    const v2y = body2.velocity.y
    
    body1.setVelocity(v2x, v2y)
    body2.setVelocity(v1x, v1y)
  }

  private setupPowerupCollisions() {
    // Powerup vs Paddle
    this.physics.add.overlap(this.powerups, this.paddle, (paddle, powerup) => {
      this.powerupHitPaddle(powerup as Powerup)
    })
  }

  public spawnPowerup(x: number, y: number, type: string): Powerup | null {
    let powerup: Powerup | null = null
    
    switch (type) {
      case 'multiball':
        powerup = new MultiballPowerup(this, x, y)
        break
      default:
        console.warn(`Unknown powerup type: ${type}`)
        return null
    }
    
    if (powerup) {
      this.powerups.add(powerup)
      // Initialize physics after adding to group
      powerup.initializePhysics()
    }
    
    return powerup
  }

  private powerupHitPaddle(powerup: Powerup) {
    // Activate the powerup
    powerup.activate(this)
    
    // Remove the powerup
    this.powerups.remove(powerup)
    powerup.destroy()
  }
}