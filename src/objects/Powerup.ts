import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class Powerup extends Phaser.Physics.Arcade.Sprite {
  public powerupType: string

  constructor(scene: Phaser.Scene, x: number, y: number, powerupType: string) {
    super(scene, x, y, '')
    
    this.powerupType = powerupType
    
    // Add to scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    // Set size to match brick dimensions
    this.setSize(GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
    
    // Create visual representation
    this.createVisual()
    
    // Set physics properties
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0, GameConfig.POWERUP_FALL_SPEED)
    body.setBounce(0, 0)
    body.setCollideWorldBounds(false)
  }

  private createVisual() {
    // Create rounded rectangle graphics
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(GameConfig.COLORS.POWERUP)
    
    // Draw rounded rectangle (relative to sprite center)
    const radius = 5
    graphics.fillRoundedRect(
      -GameConfig.BRICK_WIDTH / 2,
      -GameConfig.BRICK_HEIGHT / 2,
      GameConfig.BRICK_WIDTH,
      GameConfig.BRICK_HEIGHT,
      radius
    )
    
    // Set graphics position to match sprite
    graphics.x = this.x
    graphics.y = this.y
  }

  public activate(gameScene: any): void {
    // To be overridden by subclasses
  }

  update() {
    // Check if powerup has fallen off the bottom of the screen
    if (this.y > GameConfig.GAME_HEIGHT + GameConfig.BRICK_HEIGHT) {
      this.destroy()
    }
  }
}