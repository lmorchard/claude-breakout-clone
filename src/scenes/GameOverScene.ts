import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

interface GameOverData {
  score: number
  won: boolean
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
  }

  create(data: GameOverData) {
    const centerX = GameConfig.GAME_WIDTH / 2
    const centerY = GameConfig.GAME_HEIGHT / 2

    // Game Over / Victory message
    const message = data.won ? 'VICTORY!' : 'GAME OVER'
    const messageColor = data.won ? '#00ff00' : '#ff0000'
    
    this.add.text(centerX, centerY - 100, message, {
      fontSize: '48px',
      color: messageColor,
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    // Score
    this.add.text(centerX, centerY - 25, `Final Score: ${data.score}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    // Play again button
    const playAgainButton = this.add.text(centerX, centerY + 50, 'Play Again', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('GameScene')
    })
    .on('pointerover', () => {
      playAgainButton.setStyle({ backgroundColor: '#555555' })
    })
    .on('pointerout', () => {
      playAgainButton.setStyle({ backgroundColor: '#333333' })
    })

    // Main menu button
    const mainMenuButton = this.add.text(centerX, centerY + 100, 'Main Menu', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('StartScene')
    })
    .on('pointerover', () => {
      mainMenuButton.setStyle({ backgroundColor: '#555555' })
    })
    .on('pointerout', () => {
      mainMenuButton.setStyle({ backgroundColor: '#333333' })
    })

    // Space or Enter to play again
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('GameScene')
    })
  }
}