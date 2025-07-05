import Phaser from 'phaser'
import { GameConfig } from '../config/GameConfig'

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' })
  }

  create() {
    const centerX = GameConfig.GAME_WIDTH / 2
    const centerY = GameConfig.GAME_HEIGHT / 2

    // Title
    this.add.text(centerX, centerY - 100, 'BREAKOUT', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    // Instructions
    this.add.text(centerX, centerY, 'Click to Start', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    this.add.text(centerX, centerY + 50, 'Move mouse to control paddle', {
      fontSize: '16px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5)

    // Start game on click
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene')
    })
  }
}