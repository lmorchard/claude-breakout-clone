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
    // Implementation will be added in Phase 5
    console.log('Multiball powerup activated!')
  }
}