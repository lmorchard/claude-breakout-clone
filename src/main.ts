import Phaser from 'phaser'
import { GameConfig } from './config/GameConfig'
import { StartScene } from './scenes/StartScene'
import { GameScene } from './scenes/GameScene'
import { GameOverScene } from './scenes/GameOverScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.GAME_WIDTH,
  height: GameConfig.GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: GameConfig.COLORS.BACKGROUND,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GameConfig.GAME_WIDTH,
    height: GameConfig.GAME_HEIGHT,
    min: {
      width: 400,
      height: 533
    },
    max: {
      width: 1200,
      height: 1600
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [StartScene, GameScene, GameOverScene]
}

// Initialize the game
const game = new Phaser.Game(config)

export default game