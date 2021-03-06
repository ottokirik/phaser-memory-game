import Phaser from 'phaser';
import { GameScene } from './GameScene';

const config = {
  type: Phaser.AUTO, // webgl или canvas
  width: 1280,
  height: 720,
  scene: new GameScene(),
};

const game = new Phaser.Game(config);
