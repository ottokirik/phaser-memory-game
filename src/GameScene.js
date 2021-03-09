import { Scene, Utils } from 'phaser';
import { Card } from './Card';
import { CARD, BACKGROUND } from './keys';

export class GameScene extends Scene {
  cards = [];
  cardIds = [1, 2, 3, 4, 5];
  rows = 2;
  cols = 5;
  openedCard = null;
  openedCardsCount = 0;
  text = '';
  activeCardsCount = 0;
  timeout = 30;

  constructor(name) {
    super(name);
  }

  // Загрузить картинки
  preload() {
    this.load.image(BACKGROUND, 'images/background.png');
    this.load.image(CARD, 'images/card.png');
    this.cardIds.forEach((id) => {
      this.load.image(`${CARD}${id}`, `images/card${id}.png`);
    });
  }

  // Вывести картинки на экран
  create() {
    this.createBackground();
    this.createCards();
    this.createText();
    this.createTimer();
    this.start();
  }

  start() {
    this.timeout = 30;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.activeCardsCount = 0;
    this.initCards();
  }

  initCards() {
    const positions = this.getCardPositions();
    this.cards.forEach((card) => {
      const { x, y } = positions.pop();
      if (card.opened) {
        card.close();
      }
      card.setPosition(x, y);
    });
  }

  createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }

  createCards() {
    this.cardIds.forEach((id) => {
      this.cards.push(new Card(this, id));
      this.cards.push(new Card(this, id));
    });

    this.input.on('gameobjectdown', this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
    if (this.activeCardsCount >= 2) {
      return;
    }

    if (card.opened) {
      return;
    }

    if (!this.openedCard) {
      card.open();
      this.openedCard = card;
      this.activeCardsCount += 1;
      return;
    }

    card.open();
    this.activeCardsCount += 1;

    const timeout = setTimeout(() => {
      if (this.openedCard.id === card.id) {
        this.openedCardsCount += 2;
      } else {
        this.openedCard.close();
        card.close();
      }

      this.openedCard = null;

      clearTimeout(timeout);

      if (this.openedCardsCount === this.cards.length) {
        this.start();
      }

      this.activeCardsCount = 0;
    }, 900);
  }

  getCardPositions() {
    const cardTexture = this.textures.get(CARD).getSourceImage(); // получение изображения карты
    const [cardWidth, cardHeight] = [
      cardTexture.width + 4,
      cardTexture.height + 4,
    ];

    const offsetX =
      (this.sys.game.config.width - this.cols * cardWidth) / 2 + cardWidth / 2; // смещение, для позиционирования карт точно посередине
    const offsetY =
      (this.sys.game.config.height - this.rows * cardHeight) / 2 +
      cardHeight / 2;

    let positions = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    return Utils.Array.Shuffle(positions);
  }

  createText() {
    this.text = this.add.text(10, 10, '', {
      font: '36px sans-serif',
      fill: '#000',
      stroke: '#fff',
      strokeThickness: 2,
    });
  }

  onTimerTick() {
    this.text.setText(`Time: ${this.timeout}`);

    if (this.timeout === 0) {
      this.start();
      return;
    }

    this.timeout -= 1;
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }
}
