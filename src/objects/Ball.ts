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
      body.setCollideWorldBounds(true, 0, 0, true)
      
      // Set initial velocity
      this.resetBall()
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
    // Ensure ball maintains consistent speed
    if (this.body) {
      const currentSpeed = Math.sqrt(this.body.velocity.x ** 2 + this.body.velocity.y ** 2)
      if (currentSpeed > 0 && Math.abs(currentSpeed - GameConfig.BALL_SPEED) > 10) {
        const ratio = GameConfig.BALL_SPEED / currentSpeed
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setVelocity(body.velocity.x * ratio, body.velocity.y * ratio)
      }
    }
  }
}