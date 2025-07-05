import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class Ball extends Phaser.Physics.Arcade.Sprite {
  private speedX: number = 0
  private speedY: number = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '')
    
    // Add to scene and physics
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Create ball appearance
    this.createBallGraphics()
    
    // Configure physics body
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setCircle(GameConfig.BALL_SIZE / 2)
      body.setBounce(1, 1)
      
      // Don't use world bounds collision - we'll handle it manually
      body.setCollideWorldBounds(false)
      
      // Note: Don't call resetBall() here as it moves ball to center
      // Initial velocity will be set by the calling code
    }
  }

  private createBallGraphics() {
    // Create a simple circle graphic for the ball
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(GameConfig.COLORS.BALL)
    graphics.fillCircle(GameConfig.BALL_SIZE / 2, GameConfig.BALL_SIZE / 2, GameConfig.BALL_SIZE / 2)
    graphics.generateTexture('ball', GameConfig.BALL_SIZE, GameConfig.BALL_SIZE)
    graphics.destroy()
    
    // Set the texture
    this.setTexture('ball')
  }

  public resetBall() {
    // Position ball in center
    this.setPosition(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2)
    
    // Set random initial direction (downward)
    const angle = Phaser.Math.Between(-30, 30) // Degrees
    const radians = Phaser.Math.DegToRad(angle)
    
    this.speedX = Math.sin(radians) * GameConfig.BALL_SPEED
    this.speedY = Math.cos(radians) * GameConfig.BALL_SPEED
    
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setVelocity(this.speedX, this.speedY)
    }
  }

  public bounceOffPaddle(paddle: Phaser.Physics.Arcade.Sprite) {
    if (!this.body || !paddle.body) return

    // Calculate hit position relative to paddle center (-1 to 1)
    const paddleCenter = paddle.x
    const ballHitPos = this.x
    const hitPosition = (ballHitPos - paddleCenter) / (GameConfig.PADDLE_WIDTH / 2)
    
    // Clamp hit position
    const clampedHitPos = Phaser.Math.Clamp(hitPosition, -1, 1)
    
    // Calculate new angle based on hit position
    const maxAngle = 60 // Maximum bounce angle in degrees
    const bounceAngle = clampedHitPos * maxAngle
    const radians = Phaser.Math.DegToRad(bounceAngle)
    
    // Set new velocity (always upward)
    this.speedX = Math.sin(radians) * GameConfig.BALL_SPEED
    this.speedY = -Math.abs(Math.cos(radians) * GameConfig.BALL_SPEED)
    
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(this.speedX, this.speedY)
  }

  public bounceOffBrick(side: 'top' | 'bottom' | 'left' | 'right') {
    if (!this.body) return

    // Simple bounce physics based on collision side
    switch (side) {
      case 'top':
      case 'bottom':
        this.speedY = -this.speedY
        break
      case 'left':
      case 'right':
        this.speedX = -this.speedX
        break
    }
    
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(this.speedX, this.speedY)
  }

  public checkBottomBoundary(): boolean {
    return this.y > GameConfig.GAME_HEIGHT
  }

  update() {
    if (!this.body) return
    
    const body = this.body as Phaser.Physics.Arcade.Body
    const radius = GameConfig.BALL_SIZE / 2
    let velocityX = body.velocity.x
    let velocityY = body.velocity.y
    let velocityChanged = false
    
    // Left boundary - only bounce if moving left
    if (this.x - radius <= 0 && velocityX < 0) {
      velocityX = Math.abs(velocityX)
      this.setX(radius + 1) // Add small buffer
      velocityChanged = true
    }
    
    // Right boundary - only bounce if moving right  
    if (this.x + radius >= GameConfig.GAME_WIDTH && velocityX > 0) {
      velocityX = -Math.abs(velocityX)
      this.setX(GameConfig.GAME_WIDTH - radius - 1) // Add small buffer
      velocityChanged = true
    }
    
    // Top boundary - only bounce if moving up
    if (this.y - radius <= 0 && velocityY < 0) {
      velocityY = Math.abs(velocityY)
      this.setY(radius + 1) // Add small buffer
      velocityChanged = true
    }
    
    // Update velocity if it changed
    if (velocityChanged) {
      // Ensure the velocity maintains the correct speed
      const currentSpeed = Math.sqrt(velocityX ** 2 + velocityY ** 2)
      if (currentSpeed > 0) {
        const ratio = GameConfig.BALL_SPEED / currentSpeed
        velocityX *= ratio
        velocityY *= ratio
      }
      body.setVelocity(velocityX, velocityY)
    }
    
    // Fallback speed check and stuck ball detection
    const finalSpeed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2)
    
    if (finalSpeed < 10) {
      // Ball is stuck or moving too slowly - give it a random velocity
      const randomAngle = Math.random() * Math.PI * 2
      const newVelX = Math.cos(randomAngle) * GameConfig.BALL_SPEED
      const newVelY = Math.sin(randomAngle) * GameConfig.BALL_SPEED
      body.setVelocity(newVelX, newVelY)
      console.log(`Ball was stuck (speed: ${finalSpeed}), giving random velocity: (${newVelX}, ${newVelY})`)
    } else if (Math.abs(finalSpeed - GameConfig.BALL_SPEED) > 20) {
      // Speed is too different from target, normalize it
      const ratio = GameConfig.BALL_SPEED / finalSpeed
      body.setVelocity(body.velocity.x * ratio, body.velocity.y * ratio)
    }
  }
}