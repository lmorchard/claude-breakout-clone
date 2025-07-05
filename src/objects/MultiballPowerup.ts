import Phaser from 'phaser'
import { Powerup } from './Powerup'
import { GameConfig } from '../config/GameConfig'

export class MultiballPowerup extends Powerup {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'multiball')
    
    // Add ball icon inside the powerup
    this.createBallIcon()
  }

  private createBallIcon() {
    // Create a small ball icon in the center
    const ballGraphics = this.scene.add.graphics()
    ballGraphics.fillStyle(GameConfig.COLORS.POWERUP)
    ballGraphics.fillCircle(this.x, this.y, GameConfig.BALL_SIZE / 3)
    
    // Attach to this powerup so it moves with it
    this.add(ballGraphics)
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