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
    // Use a much simpler approach - spread balls out in safe zone
    const ballRadius = GameConfig.BALL_SIZE / 2
    const brickAreaTop = GameConfig.STATUS_BAR_HEIGHT + GameConfig.STATUS_BAR_MARGIN * 2
    const brickAreaBottom = brickAreaTop + (GameConfig.BRICK_ROWS * (GameConfig.BRICK_HEIGHT + GameConfig.BRICK_SPACING)) + GameConfig.BRICK_SPACING
    
    // Create spacing between balls based on current ball count
    const ballSpacing = 60 // Minimum distance between balls
    const currentBallCount = this.balls.length
    const safeZoneY = brickAreaBottom + 100 + (currentBallCount * 15) // Stagger Y positions
    
    // Clamp X to valid bounds with more conservative margins
    const minX = ballRadius + 20
    const maxX = GameConfig.GAME_WIDTH - ballRadius - 20
    let safeX = Math.max(minX, Math.min(maxX, x))
    
    // Add horizontal offset based on ball count to spread them out
    safeX += (currentBallCount % 4 - 2) * ballSpacing // Spread across 4 positions
    safeX = Math.max(minX, Math.min(maxX, safeX)) // Clamp again
    
    // Ensure velocities are never zero
    let finalVelX = velocityX
    let finalVelY = velocityY
    
    if (Math.abs(finalVelX) < 50) {
      finalVelX = finalVelX >= 0 ? 100 : -100
    }
    if (Math.abs(finalVelY) < 50) {
      finalVelY = finalVelY >= 0 ? 100 : -100
    }
    
    console.log(`Spawning ball ${currentBallCount} at: (${safeX}, ${safeZoneY}) with velocity (${finalVelX}, ${finalVelY})`)
    
    const newBall = new Ball(this, safeX, safeZoneY)
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
    
    // Set velocity immediately after ball is created
    if (newBall.body) {
      const body = newBall.body as Phaser.Physics.Arcade.Body
      body.setVelocity(finalVelX, finalVelY)
      console.log(`Set velocity: (${finalVelX}, ${finalVelY})`)
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

  private findSafeSpawnPosition(preferredX: number, preferredY: number): { x: number, y: number } {
    const ballRadius = GameConfig.BALL_SIZE / 2
    const minX = ballRadius
    const maxX = GameConfig.GAME_WIDTH - ballRadius
    const minY = GameConfig.STATUS_BAR_HEIGHT + ballRadius
    const maxY = GameConfig.GAME_HEIGHT - ballRadius
    
    console.log(`Finding safe spawn position for preferred (${preferredX}, ${preferredY})`)
    
    // Start with the preferred position, clamped to bounds
    let adjustedX = Math.max(minX, Math.min(maxX, preferredX))
    let adjustedY = Math.max(minY, Math.min(maxY, preferredY))
    
    // Try to find a position that doesn't overlap with any objects
    const maxAttempts = 20
    const searchRadius = 100 // Increased search radius
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Check if current position overlaps with any objects
      const colliding = this.isPositionColliding(adjustedX, adjustedY, ballRadius + 5) // Add small buffer
      console.log(`Attempt ${attempt}: position (${adjustedX.toFixed(1)}, ${adjustedY.toFixed(1)}) - colliding: ${colliding}`)
      
      if (!colliding) {
        // Found a safe position
        console.log(`Found safe position: (${adjustedX}, ${adjustedY})`)
        return { x: adjustedX, y: adjustedY }
      }
      
      // Try a new position in a spiral pattern around the preferred position
      const angle = (attempt / maxAttempts) * Math.PI * 2 * 3 // 3 spirals
      const distance = (attempt / maxAttempts) * searchRadius
      
      adjustedX = preferredX + Math.cos(angle) * distance
      adjustedY = preferredY + Math.sin(angle) * distance
      
      // Clamp to bounds again
      adjustedX = Math.max(minX, Math.min(maxX, adjustedX))
      adjustedY = Math.max(minY, Math.min(maxY, adjustedY))
    }
    
    // If we couldn't find a safe position, fall back to a safe area below bricks
    const brickAreaTop = GameConfig.STATUS_BAR_HEIGHT + GameConfig.STATUS_BAR_MARGIN * 2
    const brickAreaBottom = brickAreaTop + (GameConfig.BRICK_ROWS * (GameConfig.BRICK_HEIGHT + GameConfig.BRICK_SPACING)) + GameConfig.BRICK_SPACING
    const safeY = Math.max(brickAreaBottom + ballRadius + 50, minY) // Increased buffer
    
    console.log(`Fallback to safe area: (${preferredX}, ${safeY})`)
    return { 
      x: Math.max(minX, Math.min(maxX, preferredX)), 
      y: Math.min(safeY, maxY) 
    }
  }

  private isPositionColliding(x: number, y: number, radius: number): boolean {
    // Create a temporary circle to test collisions
    const testCircle = { x, y, radius }
    
    // Check collision with bricks
    const bricks = this.brickGrid.getBricks().children.entries
    for (const brick of bricks) {
      if (brick.active && this.circleRectCollision(testCircle, brick as any)) {
        return true
      }
    }
    
    // Check collision with paddle
    if (this.circleRectCollision(testCircle, this.paddle)) {
      return true
    }
    
    // Check collision with existing balls
    for (const ball of this.balls) {
      const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2)
      if (distance < radius + GameConfig.BALL_SIZE / 2) {
        return true
      }
    }
    
    // Check collision with powerups
    for (const powerup of this.powerups.children.entries) {
      if (powerup.active && this.circleRectCollision(testCircle, powerup as any)) {
        return true
      }
    }
    
    return false
  }

  private circleRectCollision(circle: { x: number, y: number, radius: number }, rect: any): boolean {
    // Get rectangle bounds
    const rectLeft = rect.x - rect.width / 2
    const rectRight = rect.x + rect.width / 2
    const rectTop = rect.y - rect.height / 2
    const rectBottom = rect.y + rect.height / 2
    
    // Find the closest point on the rectangle to the circle center
    const closestX = Math.max(rectLeft, Math.min(circle.x, rectRight))
    const closestY = Math.max(rectTop, Math.min(circle.y, rectBottom))
    
    // Calculate distance between circle center and closest point
    const distance = Math.sqrt((circle.x - closestX) ** 2 + (circle.y - closestY) ** 2)
    
    return distance < circle.radius
  }
}