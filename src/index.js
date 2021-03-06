import Phaser from 'phaser';

const BACKGROUND = 'background';
const CARD_BACK = 'cardBack';

const scene = new Phaser.Scene('Game');

// Загрузить картинки
scene.preload = function () {
  this.load.image(BACKGROUND, 'images/background.png');
  this.load.image(CARD_BACK, 'images/card.png');
};

// Вывести картинки на экран
scene.create = function () {
  this.add.sprite(0, 0, 'background').setOrigin(0, 0);

  const positions = this.getCardPositions();
  positions.forEach(({ x, y }) => {
    this.add.sprite(x, y, 'cardBack').setOrigin(0, 0);
  });
};

scene.getCardPositions = function () {
  const cardTexture = this.textures.get(CARD_BACK).getSourceImage(); // получение карты
  const [cardWidth, cardHeight] = [
    cardTexture.width + 4,
    cardTexture.height + 4,
  ];
  const [rows, cols] = [2, 5];

  const offsetX = (this.sys.game.config.width - cols * cardWidth) / 2; // смещение, для позиционирования карт точно посередине
  const offsetY = (this.sys.game.config.height - rows * cardHeight) / 2;

  let positions = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: offsetX + col * cardWidth,
        y: offsetY + row * cardHeight,
      });
    }
  }

  return positions;
};

const config = {
  type: Phaser.AUTO, // webgl или canvas
  width: 1280,
  height: 720,
  scene,
};

const game = new Phaser.Game(config);
