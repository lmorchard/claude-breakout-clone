import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class Brick extends Phaser.Physics.Arcade.Sprite {
  private points: number

  constructor(scene: Phaser.Scene, x: number, y: number, points: number = GameConfig.BRICK_POINTS) {
    super(scene, x, y, '')
    
    this.points = points
    
    // Add to scene and physics
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Create brick appearance
    this.createBrickGraphics()
    
    // Configure physics body
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setImmovable(true)
      body.setSize(GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
    }
  }

  private createBrickGraphics() {
    // Create a simple rectangle graphic for the brick
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(GameConfig.COLORS.BRICK)
    graphics.fillRect(0, 0, GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
    
    // Add a border for visual appeal
    graphics.lineStyle(2, 0xffffff, 0.3)
    graphics.strokeRect(0, 0, GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
    
    graphics.generateTexture('brick', GameConfig.BRICK_WIDTH, GameConfig.BRICK_HEIGHT)
    graphics.destroy()
    
    // Set the texture
    this.setTexture('brick')
  }

  public getPoints(): number {
    return this.points
  }

  public destroy() {
    // Add destruction effect if desired
    super.destroy()
  }
}

export class BrickGrid {
  private bricks: Phaser.Physics.Arcade.Group
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.bricks = scene.physics.add.group()
    this.createGrid()
  }

  private createGrid() {
    const startY = GameConfig.STATUS_BAR_HEIGHT + GameConfig.STATUS_BAR_MARGIN * 2
    const spacing = GameConfig.BRICK_SPACING
    
    // Calculate how many bricks fit horizontally
    const availableWidth = GameConfig.GAME_WIDTH - (spacing * 2)
    const brickSlotWidth = GameConfig.BRICK_WIDTH + spacing
    const bricksPerRow = Math.floor(availableWidth / brickSlotWidth)
    
    // Calculate starting X to center the grid
    const totalGridWidth = (bricksPerRow * GameConfig.BRICK_WIDTH) + ((bricksPerRow - 1) * spacing)
    const startX = (GameConfig.GAME_WIDTH - totalGridWidth) / 2 + (GameConfig.BRICK_WIDTH / 2)

    // Create brick grid
    for (let row = 0; row < GameConfig.BRICK_ROWS; row++) {
      for (let col = 0; col < bricksPerRow; col++) {
        const x = startX + (col * (GameConfig.BRICK_WIDTH + spacing))
        const y = startY + (row * (GameConfig.BRICK_HEIGHT + spacing))
        
        const brick = new Brick(this.scene, x, y)
        this.bricks.add(brick)
      }
    }
  }

  public getBricks(): Phaser.Physics.Arcade.Group {
    return this.bricks
  }

  public destroyBrick(brick: Brick): number {
    const points = brick.getPoints()
    brick.destroy()
    return points
  }

  public getRemainingCount(): number {
    return this.bricks.countActive()
  }

  public areAllDestroyed(): boolean {
    return this.getRemainingCount() === 0
  }
}