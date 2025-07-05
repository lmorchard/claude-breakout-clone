import Phaser from 'phaser'
import { Powerup } from './Powerup'
import { GameConfig } from '../config/GameConfig'

export class MultiballPowerup extends Powerup {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'multiball')
    
    // The visual is created in the parent constructor
    // We'll override the visual creation to include the ball icon
  }

  protected createVisual() {
    // Create a texture key for multiball powerup
    const textureKey = `powerup-multiball`
    
    // Only create the texture if it doesn't exist
    if (!this.scene.textures.exists(textureKey)) {
      // Create graphics to draw the powerup shape
      const graphics = this.scene.add.graphics()
      
      // Draw background rounded rectangle
      graphics.fillStyle(GameConfig.COLORS.POWERUP)
      const radius = 5
      graphics.fillRoundedRect(
        0, 0, 
        GameConfig.BRICK_WIDTH,
        GameConfig.BRICK_HEIGHT,
        radius
      )
      
      // Draw ball icon in center
      graphics.fillStyle(GameConfig.COLORS.BALL)
      graphics.fillCircle(
        GameConfig.BRICK_WIDTH / 2,
        GameConfig.BRICK_HEIGHT / 2,
        GameConfig.BALL_SIZE / 3
      )
      
      // Generate texture from graphics
      graphics.generateTexture(textureKey, GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
      graphics.destroy()
    }
    
    // Set the texture for this sprite
    this.setTexture(textureKey)
  }

  public activate(gameScene: any): void {
    // Get current balls from the game scene
    const currentBalls = gameScene.balls || []
    
    // For each existing ball, spawn a new ball nearby with inverted X velocity
    currentBalls.forEach((ball: any) => {
      if (ball.body) {
        const body = ball.body
        const currentX = ball.x
        const currentY = ball.y
        const currentVelocityX = body.velocity.x
        const currentVelocityY = body.velocity.y
        
        // Calculate new position with offset
        const newX = currentX + GameConfig.BALL_SPAWN_OFFSET
        const newY = currentY
        
        // Invert X velocity, keep Y velocity the same
        const newVelocityX = -currentVelocityX
        const newVelocityY = currentVelocityY
        
        // Spawn the new ball
        gameScene.addBall(newX, newY, newVelocityX, newVelocityY)
      }
    })
    
    console.log(`Multiball activated! Ball count: ${currentBalls.length} -> ${gameScene.getBallCount()}`)
  }
}