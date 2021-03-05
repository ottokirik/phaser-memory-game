const scene = new Phaser.Scene('Game');

// Load background
scene.preload = () => {};

// Print background
scene.create = () => {};

const config = {
  type: Phaser.AUTO, // webgl or canvas
  width: 1280,
  height: 720,
  scene,
};

const game = new Phaser.Game(config);
