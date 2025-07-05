import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class GameScene extends Phaser.Scene {
  private score: number = 0
  private lives: number = GameConfig.INITIAL_LIVES
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private pauseButton!: Phaser.GameObjects.Text
  private isPaused: boolean = false

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
    // Game objects will be implemented in Phase 3
    // For now, just show a placeholder
    this.add.text(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2, 'Game objects will be added in Phase 3', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)
  }

  private setupInput() {
    // ESC key for pause
    this.input.keyboard!.on('keydown-ESC', () => {
      this.togglePause()
    })
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
    }
  }

  public checkWin() {
    // Will be implemented when bricks are added
    // For now, assume win after 10 seconds for testing
  }
}