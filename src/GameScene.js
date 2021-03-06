import { Scene, Utils } from 'phaser';
import { Card } from './Card';
import { CARD, BACKGROUND } from './keys';

export class GameScene extends Scene {
  cards = [];
  cardIds = [1, 2, 3, 4, 5];
  rows = 2;
  cols = 5;
  openedCard = null;

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
  }

  createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }

  createCards() {
    const positions = Utils.Array.Shuffle(this.getCardPositions());

    this.cardIds.forEach((id) => {
      this.cards.push(new Card(this, id, positions.pop()));
      this.cards.push(new Card(this, id, positions.pop()));
    });

    this.input.on('gameobjectdown', this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
    if (card.opened) {
      return;
    }

    if (!this.openedCard) {
      card.open();
      this.openedCard = card;
      return;
    }

    card.open();

    const timeout = setTimeout(() => {
      if (this.openedCard.id === card.id) {
        this.openedCard = null;
      } else {
        this.openedCard.close();
        card.close();
        this.openedCard = null;
      }
      clearTimeout(timeout);
    }, 500);
  }

  getCardPositions() {
    const cardTexture = this.textures.get(CARD).getSourceImage(); // получение изображения карты
    const [cardWidth, cardHeight] = [
      cardTexture.width + 4,
      cardTexture.height + 4,
    ];

    const offsetX = (this.sys.game.config.width - this.cols * cardWidth) / 2; // смещение, для позиционирования карт точно посередине
    const offsetY = (this.sys.game.config.height - this.rows * cardHeight) / 2;

    let positions = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    return positions;
  }
}
