import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class Powerup extends Phaser.Physics.Arcade.Sprite {
  public powerupType: string

  constructor(scene: Phaser.Scene, x: number, y: number, powerupType: string) {
    super(scene, x, y, '')
    
    this.powerupType = powerupType
    
    // Create visual representation first
    this.createVisual()
    
    // Add to scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    // Set size to match brick dimensions
    this.setSize(GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
    
    // Physics properties will be set after adding to physics group
  }

  protected createVisual() {
    // Create a texture key for this powerup type
    const textureKey = `powerup-${this.powerupType}`
    
    // Only create the texture if it doesn't exist
    if (!this.scene.textures.exists(textureKey)) {
      // Create graphics to draw the powerup shape
      const graphics = this.scene.add.graphics()
      graphics.fillStyle(GameConfig.COLORS.POWERUP)
      
      // Draw rounded rectangle
      const radius = 5
      graphics.fillRoundedRect(
        0, 0, 
        GameConfig.BRICK_WIDTH,
        GameConfig.BRICK_HEIGHT,
        radius
      )
      
      // Generate texture from graphics
      graphics.generateTexture(textureKey, GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
      graphics.destroy()
    }
    
    // Set the texture for this sprite
    this.setTexture(textureKey)
  }

  public initializePhysics(): void {
    // Set physics properties after being added to physics group
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0, GameConfig.POWERUP_FALL_SPEED)
      body.setBounce(0, 0)
      body.setCollideWorldBounds(false)
    }
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