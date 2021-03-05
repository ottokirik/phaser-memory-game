import Phaser from 'phaser';

const scene = new Phaser.Scene('Game');

// Load background
scene.preload = function () {
  this.load.image('background', 'images/background.png');
};

// Print background
scene.create = function () {
  this.add.sprite(0, 0, 'background').setOrigin(0, 0);
};

const config = {
  type: Phaser.AUTO, // webgl or canvas
  width: 1280,
  height: 720,
  scene,
};

const game = new Phaser.Game(config);
