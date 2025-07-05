import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'
import { Ball } from '../objects/Ball'
import { Paddle } from '../objects/Paddle'
import { BrickGrid } from '../objects/Brick'

export class GameScene extends Phaser.Scene {
  private score: number = 0
  private lives: number = GameConfig.INITIAL_LIVES
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private pauseButton!: Phaser.GameObjects.Text
  private isPaused: boolean = false

  // Game objects
  private ball!: Ball
  private paddle!: Paddle
  private brickGrid!: BrickGrid
  private isWaitingToStart: boolean = false
  private readyText?: Phaser.GameObjects.Text

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
    this.setupCollisions()
    
    // Start with "ready" state
    this.showReadyPrompt()
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
    // Create paddle
    this.paddle = new Paddle(this)
    
    // Create ball
    this.ball = new Ball(this, GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2)
    
    // Create brick grid
    this.brickGrid = new BrickGrid(this)
  }

  private setupInput() {
    // ESC key for pause
    this.input.keyboard!.on('keydown-ESC', () => {
      this.togglePause()
    })
  }

  private setupCollisions() {
    // Ball vs Paddle
    this.physics.add.collider(this.ball, this.paddle, () => {
      this.ball.bounceOffPaddle(this.paddle)
    })

    // Ball vs Bricks
    this.physics.add.collider(this.ball, this.brickGrid.getBricks(), (_ball, brick) => {
      // Determine collision side (simplified)
      this.ball.bounceOffBrick('top')
      
      // Destroy brick and award points
      const points = this.brickGrid.destroyBrick(brick as any)
      this.updateScore(points)
      
      // Check for victory
      if (this.brickGrid.areAllDestroyed()) {
        this.scene.start('GameOverScene', { score: this.score, won: true })
      }
    })
  }

  private showReadyPrompt() {
    this.isWaitingToStart = true
    this.ball.setPosition(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2)
    
    // Stop ball movement
    if (this.ball.body) {
      const body = this.ball.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0, 0)
    }

    this.readyText = this.add.text(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2 + 100, 
      'Click to Launch Ball', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    // Start ball on click
    this.input.once('pointerdown', () => {
      this.startBall()
    })
  }

  private startBall() {
    this.isWaitingToStart = false
    if (this.readyText) {
      this.readyText.destroy()
      this.readyText = undefined
    }
    this.ball.resetBall()
  }

  update() {
    if (this.isPaused || this.isWaitingToStart) return

    // Update ball
    this.ball.update()

    // Check if ball fell off bottom
    if (this.ball.checkBottomBoundary()) {
      this.loseLife()
    }
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
    } else {
      // Show ready prompt for next life
      this.showReadyPrompt()
    }
  }
}