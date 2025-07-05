import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class Paddle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    const x = GameConfig.GAME_WIDTH / 2
    const y = GameConfig.GAME_HEIGHT - GameConfig.PADDLE_Y_OFFSET
    
    super(scene, x, y, '')
    
    // Add to scene and physics
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Create paddle appearance
    this.createPaddleGraphics()
    
    // Configure physics body
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setImmovable(true)
      body.setSize(GameConfig.PADDLE_WIDTH, GameConfig.PADDLE_HEIGHT)
    }

    // Set up mouse input
    this.setupInput()
  }

  private createPaddleGraphics() {
    // Create a simple rectangle graphic for the paddle
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(GameConfig.COLORS.PADDLE)
    graphics.fillRect(0, 0, GameConfig.PADDLE_WIDTH, GameConfig.PADDLE_HEIGHT)
    graphics.generateTexture('paddle', GameConfig.PADDLE_WIDTH, GameConfig.PADDLE_HEIGHT)
    graphics.destroy()
    
    // Set the texture
    this.setTexture('paddle')
  }

  private setupInput() {
    // Enable mouse input for the scene
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.updatePosition(pointer.x)
    })

    // Also handle touch input
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.updatePosition(pointer.x)
      }
    })
  }

  private updatePosition(pointerX: number) {
    // Convert screen coordinates to game coordinates
    const camera = this.scene.cameras.main
    const gameX = camera.scrollX + (pointerX - camera.x) / camera.zoom

    // Clamp paddle position to game bounds
    const halfWidth = GameConfig.PADDLE_WIDTH / 2
    const clampedX = Phaser.Math.Clamp(gameX, halfWidth, GameConfig.GAME_WIDTH - halfWidth)
    
    this.setX(clampedX)
  }

  public getHitPosition(ballX: number): number {
    // Return hit position relative to paddle center (-1 to 1)
    const paddleCenter = this.x
    const hitPosition = (ballX - paddleCenter) / (GameConfig.PADDLE_WIDTH / 2)
    return Phaser.Math.Clamp(hitPosition, -1, 1)
  }

  update() {
    // Paddle updates are handled by input events
    // This method can be used for any per-frame logic if needed
  }
}